---
layout: post
title: An Exploration of Parallel Computing
date: 08-02-2025
categories: [Blog]
tags: [multi-thread, simd, simt, cuda, rocm]
---

## What is Parallel Computing?
Parallel computing is a computational technique where multiple tasks or operations are executed simultaneously, leveraging multiple processors, cores, and/or computers over a network to solve problems more efficiently than traditional sequential processing. By dividing a problem into smaller, manageable parts that can be processed concurrently, parallel computing significantly speeds up computations. In this blog, I will be sharing the results of my informal exploration into the world of parallel computing.

## How Did I Get Here?
Like many of the endeavors I have taken in my computer science journey, it always start out as a simple question before I inevitably descend into an endless rabbit hole. In this particular case, it began as a question on a Saturday night several months ago on how to reduce a CPU bottleneck in a video game. Then, in a series of events, I ended up reading the spec sheets and documentation for my CPU and GPU, which is an AMD Zen 4 processor and a Radeon 7000 series graphics card, respectively.

The documentations described using SIMD (single instruction, multiple data) and SIMT (single instruction, multiple thread) instructions to parallelize computations. It's a fairly easy concept to understand at a high level. However, I am a firm believer that it's not possible to truly understand something unless I've tried it for myself. This is where my exploration of SIMD/SIMT instructions, GPU programming, and CPU multi-threading began.

## Exploration Begins!
First, I need to define a set of control scenarios for my experiments. For the sake of demonstrating, I chose a highly parallel task of applying arithmetic operations to an array of numbers. Although many real world scenarios cannot be easily refactored to smaller parallel tasks, this example will suffice.

### Traditional Single-Threaded Processing:
In a traditional computer program, a processor must access each element and perform the operation one-by-one in sequence. Although modern CPUs use techniques such as instruction [pipelining](https://en.wikipedia.org/wiki/Pipeline_(computing)) and [out-of-order execution](https://en.wikipedia.org/wiki/Out-of-order_execution) to take advantage of some amount of instruction level parallelism, the overall execution is still sequential.

To demonstrate single-thread processing in action and to use this as a baseline comparison for my experiments, I've written a C++ program that simulate a workload on 1 billion single-precision floating point numbers by incrementing each element by one for a number of iterations.

> I also made a modification to swap the inner and outer loop in an attempt to take advantage of cache locality. Although this produced no benefits in this test, this will become important in later explorations.
{: .prompt-info}

```c++
// Single-threaded workload
void count_function(float* a, long int size, int iterations) {
	for (int j = 0; j < iterations; j++) {
		for (int i = 0; i < size; i++) {
			a[i] += 1;
		}
	}
}

// Modified single-threaded workload
void count_function(float* a, long int size, int iterations) {
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < iterations; j++) {
			a[i] += 1;
		}
	}
}
```

In both versions of the single-threaded test, it took about 15-16 seconds to complete 10 iterations. This will be the baseline of my comparison moving forward.

![Desktop View](/assets/images/exploration-of-parallel-computing/single-threaded-benchmark.png){: width="500"}

> It is important to verify the assembly instructions emitted by the compiler to ensure no fancy shortcuts are used to compute the simulated workload. For example, a compiler optimization might be to compute one element and then apply it to the other elements.
{: .prompt-warning}

### Multi-threaded Processing:
The logical continuation of this exploration is to rewrite the program to use multi-threading. By parallelizing the workload between multiple threads, the performance should speed-up by factors proportional to the number of threads. Note that the core workload functions defined above is unmodified. Only the main function is modified to launch multiple threads.

```c++
#define NUM 1000000000
int main() {
  /* ... */
  std::thread threads[THREADS];

  long int chunk_size = NUM / THREADS;
  for (int j = 0; j < THREADS; j++) {

    int chunk_start = chunk_size * j;
    threads[j] = std::thread(count_function, &a[chunk_start], chunk_size, iterations);
  }
  for (int j = 0; j < THREADS; j++) {
    threads[j].join();
  }
  /* ... */
}
```

![Desktop View](/assets/images/exploration-of-parallel-computing/multi-threaded-benchmark-10.png){: width="500"}

> The `CPU time` measured is the sum of the processing time used by all threads. The `real` time give a more accurate estimate of the time between the program start and finish.
{: .prompt-tip}

Using multi-threading on a 6 core 12 threads Zen 4 processor, it takes about 3 seconds to complete the same workload. If I were to keep the processing time constant (see below), the multi-threaded program is able to process about 7 times more!

![Desktop View](/assets/images/exploration-of-parallel-computing/multi-threaded-benchmark-70.png){: width="500"}

> Please note that there are overhead associated with launching and joining threads. Also, [Hyper-threading](https://en.wikipedia.org/wiki/Hyper-threading)/[SMT](https://en.wikipedia.org/wiki/Simultaneous_multithreading) do not exactly double the performance. Therefore, the total speed-up is not 12 times faster.
{: .prompt-info}

### SIMD Instructions:
Here is where the interesting part begins. On modern processors, there are special instructions programmers can use to "bundle up" data for the CPU to process all at once. This blog is not a lesson on what SIMD instructions are so feel free to learn about it [here]() instead.
