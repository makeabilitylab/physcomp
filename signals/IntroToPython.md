---
layout: default
title: Intro to Python
has_toc: true # on by default
has_children: true
nav_exclude: false
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

# Python Tutorial
This notebook provides an overview of and playground for **Python**. It is heavily based on the [Python tutorial](http://cs231n.github.io/python-numpy-tutorial/) by Justin Johnson, Volodymyr Kuleshov, and Isaac Caswell for Stanford's course on [Convolutional Neural Neworks for Visual Recognition](https://cs231n.github.io/). You can view their original raw notebook [here](https://github.com/kuleshov/cs228-material). 

The tutorial is best viewed in a Notebook with auto-generated table of contents like [TOC2](https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/nbextensions/toc2/README.html) or [Google Colab](https://colab.research.google.com/). 

## Table of Contents
1. [Introduction](#Introduction)
2. [Basic Data Types](#Basic-Data-Types)
3. [Containers](#Containers)
4. [Functions](#Functions)
5. [Classes](#Classes)

## Changelist
- Updated all examples to Python 3
- Changed string formatting to use string.format
- Added additional examples for lists, tuples, dictionaries, and classes
- Added class variables vs. class instance variables
- Added examples of using "reflection" to dynamically invoke methods and member variables
- Added examples of how to use random.seed() to generate same series of pseudo-random numbers
- Added examples of how to generate lists with random values

## References
- The official [Python tutorial](https://docs.python.org/3/tutorial/index.html), Python.org

## Introduction

Python is a high-level, dynamically typed multiparadigm programming language. Python code is often said to be almost like pseudocode, since it allows you to express very powerful ideas in very few lines of code while being very readable. As an example, here is an implementation of the classic quicksort algorithm in Python:


```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3,6,8,10,1,2,1]))
```

    [1, 1, 2, 3, 6, 8, 10]
    

### Python Versions
There are two dramatically different versions of Python: Python 2 and Python 3. For a long time, Python 3 adoption was low largely because of backward compatibility problems with libraries from Python 2. However, this is finally changing. So, in this class, we will be using Python 3 (which is what Anaconda installed if you followed that installation approach). To check which version you are using, drop into Anaconda's terminal and type `python --version`. For example, on my **Windows** box, I open `Anaconda Prompt` and type in:
```
(base) C:\Users\jonf>python --version
Python 3.6.7 :: Anaconda, Inc.
```

On my **Mac**, I open iTerm and type in:
```
~jonf$ python --version
Python 3.6.6 :: Anaconda, Inc.
```

See [Vinko Kodžoman, Things you’re probably not using in Python 3 – but should](https://datawhatnow.com/things-you-are-probably-not-using-in-python-3-but-should/)

### Style!
If you're like me, you likely bounce between lots of different programming languages (like C/C++ in Arduino, Java in Processing, and Python in Jupyter Notebook and beyond). I try to adopt the correct styles and coding conventions for each language but often times I fall back to CamelCase or some crazy hybrid. :-/

From the [official style guide](https://www.python.org/dev/peps/pep-0008/):

> **Function names** should be lowercase, with words separated by underscores as necessary to improve readability.
>
> **Variable names** follow the same convention as function names.
>
> mixedCase is allowed only in contexts where that's already the prevailing style (e.g. threading.py), to retain backwards compatibility. for more.

You should consult the [official style guide](https://www.python.org/dev/peps/pep-0008/) for more details.

I also recently found the [official Google style guide for Python](https://google.github.io/styleguide/pyguide.html).

## Basic Data Types

### Numbers

Integers and floats work as you would expect from other languages:


```python
x = 3
print(x, type(x))
```

    3 <class 'int'>
    


```python
print(x + 1)   # Addition;
print(x - 1)   # Subtraction;
print(x * 2)   # Multiplication;
print(x ** 2)  # Exponentiation;
```

    4
    2
    6
    9
    


```python
x += 1
print(x)  # Prints "4"
x *= 2
print(x)  # Prints "8"
```

    4
    8
    


```python
y = 2.5
print(type(y)) # Prints "<type 'float'>"
print(y, y + 1, y * 2, y ** 2) # Prints "2.5 3.5 5.0 6.25"
```

    <class 'float'>
    2.5 3.5 5.0 6.25
    

Note that unlike many languages, Python does not have unary increment (`x++`) or decrement (`x--`) operators. Instead, you can do `x += 1` and `x -= 1`

Python also has built-in types for long integers and complex numbers; you can find all of the details in the [documentation](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-long-complex).

### Booleans

Python implements all of the usual operators for Boolean logic, but uses English words rather than symbols (`&&`, `||`, etc.):


```python
t, f = True, False
print(type(t)) # Prints "<type 'bool'>"
```

    <class 'bool'>
    

Now we let's look at the operations:


```python
print(t and f) # Logical AND;
print(t or f)  # Logical OR;
print(not t)   # Logical NOT;
print(t != f)  # Logical XOR;
```

    False
    True
    False
    True
    

### Strings


```python
hello = 'hello'   # String literals can use single quotes
world = "world"   # or double quotes; it does not matter.
print(hello, len(hello))
```

    hello 5
    


```python
hw = hello + ' ' + world  # String concatenation
print(hw)  # prints "hello world"
```

    hello world
    


```python
hw12 = '%s %s %d' % (hello, world, 12)  # sprintf style string formatting
print(hw12)  # prints "hello world 12"
```

    hello world 12
    

I typically use the format function for formatting strings, which is far more flexible and alot like [.NET's String.Format method](https://docs.microsoft.com/en-us/dotnet/api/system.string.format?view=netframework-4.8) (which I've always found quite elegant). See: https://pyformat.info/


```python
import math
s = "x={} y={} '{} {}' pi={:1.5f}".format(x, y, hello, world, math.pi)
print(s)
```

    x=8 y=2.5 'hello world' pi=3.14159
    


```python
# You can also do this out-of-order using index-based positional formatting
s = "x={1} y={0}".format(y, x)
print(s)
```

    x=8 y=2.5
    

String objects have a bunch of useful methods; for example:


```python
s = "hello"
print s.capitalize()  # Capitalize a string; prints "Hello"
print s.upper()       # Convert a string to uppercase; prints "HELLO"
print s.rjust(7)      # Right-justify a string, padding with spaces; prints "  hello"
print s.center(7)     # Center a string, padding with spaces; prints " hello "
print s.replace('l', '(ell)')  # Replace all instances of one substring with another;
                               # prints "he(ell)(ell)o"
print '  world '.strip()  # Strip leading and trailing whitespace; prints "world"
```


      File "<ipython-input-13-0c7abe5f56a2>", line 2
        print s.capitalize()  # Capitalize a string; prints "Hello"
              ^
    SyntaxError: invalid syntax
    


You can find a list of all string methods in the [documentation](https://docs.python.org/3/library/stdtypes.html#string-methods).

## Containers

Python includes several built-in container types: [lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists), [dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries), [sets](https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset), and [tuples](https://docs.python.org/3/library/stdtypes.html#tuples). Python does not have "arrays" *per se*; instead, use lists.

### Lists

A [list](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists) is the Python equivalent of an array, but is resizeable and can contain elements of different types:


```python
xs = [3, 1, 2]    # Create a list
print(xs)
print(xs[2])
print(xs[-1])     # Negative indices count from the end of the list; prints "2"
```


```python
xs[2] = 'foo'    # Lists can contain elements of different types
print(xs)
```


```python
xs.append('bar') # Add a new element to the end of the list
print(xs) 

# append is equivalent to a[len(a):] = [x].
xs[len(xs):] = ["hello"]
print(xs)
```


```python
x = xs.pop()     # Remove and return the last element of the list
print(x, xs) 
```

An example that uses most of the list methods:


```python
fruits = ['orange', 'apple', 'pear', 'banana', 'kiwi', 'apple', 'banana']
print("The num of apples: ", fruits.count('apple'))
print("The num of tangerines: ", fruits.count('tangerine'))
print("The num of bananas: ", fruits.count('banana'))

banana_index = fruits.index('banana')
print("The first 'banana' index: ", banana_index)
print("The second 'banana' index: ", fruits.index('banana', banana_index + 1))

print("\nFull fruit list...")
print(fruits)

fruits.reverse()
print("\nReversing fruits...")
print(fruits)

print("\nAppending grape...")
fruits.append('grape')
print(fruits)

fruits.sort()
print("\nSorting fruits...")
print(fruits)

print("\nPopping the last fruit...")
last_fruit = fruits.pop()
print("last_fruit =", last_fruit)
print(fruits)
```

Playing around with sorting lists using lambdas (in this case, lists of tuples)


```python
l = [("c", 2), ("d", 6), ("d", 1), ("z", 44), ("a",11)]
print(l)
l.sort(key=lambda x: x[0]) # sort by the first term in the tuple
print(l)
l.sort(key=lambda x: x[1]) # sort by the second term in the tuple
print(l)
l.sort(key=lambda x: x[0], reverse=True) # reverse sort by the first term in the tuple
print(l)
l.sort(key=lambda x: x[1], reverse=True) # reverse sort by the second term in the tuple
print(l)
```

#### List s
licing

In addition to accessing list elements one at a time, Python provides concise syntax to access sublists; this is known as slicing—a very powerful (though sometimes confusing) technique:


```python
nums = list(range(5))     # range is a built-in function that creates a list of integers
print(nums)         # Prints "[0, 1, 2, 3, 4]"
print(nums[2:4])    # Get a slice from index 2 to 4 (exclusive); prints "[2, 3]"
print(nums[2:])     # Get a slice from index 2 to the end; prints "[2, 3, 4]"
print(nums[:2])     # Get a slice from the start to index 2 (exclusive); prints "[0, 1]"
print(nums[:])      # Get a slice of the whole list; prints ["0, 1, 2, 3, 4]"
print(nums[:-1])    # Slice indices can be negative; prints ["0, 1, 2, 3]"
nums[2:4] = [8, 9]  # Assign a new sublist to a slice
print(nums)         # Prints "[0, 1, 8, 9, 4]"
```


```python
testList = [1, 2, 3, 4, 5]
index = 2
print(testList[0:index])
print(testList[(index + 1):5])
print(testList[0:index] + testList[(index + 1):5])
```

#### List loops

You can loop over the elements of a list like this:


```python
animals = ['cat', 'dog', 'monkey']
for animal in animals:
    print(animal)
```

If you want access to the index of each element within the body of a loop, use the built-in `enumerate` function:


```python
animals = ['cat', 'dog', 'monkey']
for idx, animal in enumerate(animals):
    print('{}: {}'.format(idx, animal))
```

This may not be particularly Pythonic but you can also loop like this:


```python
animals = ['cat', 'dog', 'monkey']
for i in range(0, len(animals)):
    print('{}: {}'.format(i, animals[i]))
```

#### List comprehensions

List [comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions) are a powerful, compact expression in Python. When programming, frequently we want to transform one type of data into another. As a simple example, consider the following code that computes square numbers:


```python
nums = [0, 1, 2, 3, 4]
squares = []
for x in nums:
    squares.append(x ** 2)
print(squares)
```

You can make this code simpler using a list comprehension:


```python
nums = [0, 1, 2, 3, 4]
squares = list(map(lambda x: x**2, nums))
print(squares)
```

Or, equivalently (and even more compactly and readable):


```python
nums = [0, 1, 2, 3, 4]
squares = [x ** 2 for x in nums]
print(squares)
```

List comprehensions can also contain conditions:


```python
nums = [0, 1, 2, 3, 4]
even_squares = [x ** 2 for x in nums if x % 2 == 0]
print(even_squares)
```

#### Generating a random list
You can also use list comprehension to make a list of random values


```python
import random 
num_rand_data_points = 4
rand_vals = [random.randrange(0, 9, 1) for i in range(num_rand_data_points)]
print(rand_vals)
```

    [1, 2, 1, 6]
    

You can also use [`random.sample`](https://docs.python.org/3/library/random.html#random.sample)


```python
rand_vals = random.sample(range(0, 9), 4)
print(rand_vals)
```

    [4, 1, 0, 5]
    

### Dictionaries

A Python [dictionary](https://docs.python.org/3/library/stdtypes.html#dict) stores (key, value) pairs, similar to a `Map` in Java or an object in Javascript. You can use it like this:


```python
d = {'cat': 'cute', 'dog': 'furry'}  # Create a new dictionary with some data
print(d['cat'])       # Get an entry from a dictionary; prints "cute"
print('cat' in d)     # Check if a dictionary has a given key; prints "True"
```

    cute
    True
    


```python
d['fish'] = 'wet'    # Set an entry in a dictionary
print(d['fish'])      # Prints "wet"
```

    wet
    


```python
print(d['monkey'])  # KeyError: 'monkey' not a key of d
```


    ---------------------------------------------------------------------------

    KeyError                                  Traceback (most recent call last)

    <ipython-input-18-78fc9745d9cf> in <module>
    ----> 1 print(d['monkey'])  # KeyError: 'monkey' not a key of d
    

    KeyError: 'monkey'



```python
print(d.get('monkey', 'N/A'))  # Get an element with a default; prints "N/A"
print(d.get('fish', 'N/A'))    # Get an element with a default; prints "wet" (because we mapped this earlier)
```


```python
d['fish'] = 'wet'           # Set an entry in a dictionary
del d['fish']               # Remove an element from a dictionary
print(d.get('fish', 'N/A')) # "fish" is no longer a key; prints "N/A"
```

To iterate over the keys in a dictionary, you can use the basic for loop construction:


```python
d = {'person': 2, 'cat': 4, 'spider': 8}
for animal in d:
    legs = d[animal]
    print('A {} has {} legs'.format(animal, legs))
```

If you want access to keys and their corresponding values, use the items method:


```python
d = {'person': 2, 'cat': 4, 'spider': 8}
for animal, legs in d.items():
    print('A {} has {} legs'.format(animal, legs))
```

**Deleting** an item out of a dictionary


```python
import random
testDict = {"a":1, "c":3, "d":4}
a = list(testDict.keys())
print(a)
random.shuffle(a)
print(a)
del a[1]
print(a)
```

#### Dictionary comprehensions
These are similar to list comprehensions, but allow you to easily construct dictionaries. For example:


```python
nums = [0, 1, 2, 3, 4]
even_num_to_square = {x: x ** 2 for x in nums if x % 2 == 0}
print(even_num_to_square)
```

#### Shallow vs. deep copies
This is relevant to all container types but showing here for dictionaries.


```python
# playing around with shallow vs. deep copies in python
# see shallow copy: https://stackoverflow.com/a/3975388
import copy
testDict = {"a":[1, 2], "c":[3, 4]}
print(testDict) # prints {'a': [1, 2], 'c': [3, 4]}
testDict['b'] = [2, 3]

newDict = testDict # just creates a new reference to this dict
newDict["z"] = [26]
newDict["a"].append(99)

newDict2 = testDict.copy() # again, just creates a new reference to this dict
newDict2["c"].append(44)

newDict3 = copy.deepcopy(testDict) # makes a deep copy of the values
newDict3["n"] = [14, 15]

print(testDict) # prints {'a': [1, 2, 99], 'c': [3, 4, 44], 'b': [2, 3], 'z': [26]}
print(newDict)  # prints {'a': [1, 2, 99], 'c': [3, 4, 44], 'b': [2, 3], 'z': [26]}
print(newDict2) # prints {'a': [1, 2, 99], 'c': [3, 4, 44], 'b': [2, 3], 'z': [26]}
print(newDict3) # prints {'a': [1, 2, 99], 'c': [3, 4, 44], 'b': [2, 3], 'z': [26], 'n': [14, 15]}
```

### Sets

A [set](https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset) is an unordered collection of distinct elements. As a simple example, consider the following:


```python
animals = {'cat', 'dog'}
print 'cat' in animals   # Check if an element is in a set; prints "True"
print 'fish' in animals  # prints "False"

```


```python
animals.add('fish')      # Add an element to a set
print 'fish' in animals
print len(animals)       # Number of elements in a set;
```


```python
animals.add('cat')       # Adding an element that is already in the set does nothing
print len(animals)       
animals.remove('cat')    # Remove an element from a set
print len(animals)       
```

#### Looping over sets 
Iterating over a set has the same syntax as iterating over a list; however since sets are unordered, you cannot make assumptions about the order in which you visit the elements of the set:


```python
animals = {'cat', 'dog', 'fish'}
for idx, animal in enumerate(animals):
    print("{}: {}".format(idx, animal))
# Prints "#1: fish", "#2: dog", "#3: cat"
```

#### Set comprehensions 
Like lists and dictionaries, we can easily construct sets using set comprehensions:


```python
from math import sqrt
print({int(sqrt(x)) for x in range(30)})
```

#### Tuples

A [tuple](https://docs.python.org/3/library/stdtypes.html#tuples) is an (immutable) ordered list of values. A tuple is in many ways similar to a list; one of the most important differences is that tuples can be used as keys in dictionaries and as elements of sets, while lists cannot. Here is a trivial example:


```python
d = {(x, x + 1): x for x in range(10)}  # Create a dictionary with tuple keys
t = (5, 6)       # Create a tuple
print(type(t))
print(d[t])       
print(d[(1, 2)])
print(d[(7, 8)])

```


```python
# this code should throw an error because the tuple object does not support assignment
t[0] = 1 
```

You can **unpack** tuples:


```python
# Experimenting with how packing and unpacking tuples work
test_tuple = (1,2,3,4,5,6,7,8,9,10)
print(test_tuple)
print(*test_tuple)
print(*test_tuple[1:])

test_tuple2 = (1, 2, 3)
x, y, z = test_tuple2
print(test_tuple2)
print(x, y, z)
```


```python
# experimenting with unpacking tuples
testTuple = (1, 3, 5, 7)
one, two, three, four = testTuple
print(one, two, three, four)
```

## Functions

Python [functions](https://docs.python.org/3/library/stdtypes.html#functions) are defined using the `def` keyword. For example:


```python
def sign(x):
    if x > 0:
        return 'positive'
    elif x < 0:
        return 'negative'
    else:
        return 'zero'

for x in range(-1, 2):
    print("{} is {}".format(x, sign(x)))
```

We will often define functions to take **optional keyword arguments** where we supply a default if the argument is not passed, like this:


```python
def hello(name, loud=False):
    if loud:
        print('HELLO', name.upper())
    else:
        print('Hello', name)

hello('Bob')
hello('Fred', loud=True)
hello('Jon', loud=False)
```

We can do something even more impressive and flexible, we can use the `*` as a prefix to accept an **arbitrary number of arguments**


```python
# Here, we specify a function can be called with an arbitrary number of arguments. 
# These arguments will be wrapped up in a tuple. Before the variable number of arguments, 
# zero or more normal arguments may occur.
# See: https://docs.python.org/3/tutorial/controlflow.html

def sum(x, y, *args):
    print("args:", args)
    sum_args = 0
    for num in args:
        sum_args += num
    return x + y + sum_args 

s = sum(1,2,3)
print(s)
s = sum(1,2,3,4)
print(s)
```

As you might imagine, `*args` tends to be last in the list of formal parameters, because they scoop up all remaining input arguments that are passed to the function. Any formal parameters which occur after the `*args` parameter are ‘keyword-only’ arguments, meaning that they can only be used as keywords rather than positional arguments. For example:


```python
def calc(x, y, *args, operation="sum"):
    if(operation == "sum"):
        sum_args = 0
        for num in args:
            sum_args += num
        return x + y + sum_args
    elif(operation == "mult"):
        mult_args = 1
        for num in args:
            mult_args *= num
        return x * y * mult_args
    else:
        raise Exception('No such operation ' + operation)
        

s = calc(1,2)
print(s)                            # prints 3 (1 + 2)
s = calc(1,2,operation="mult")    
print(s)                            # prints 2 (1 * 2)
s = calc(1,2,3,4)
print(s)                            # prints 10 (1 + 2 + 3 + 4)
s = calc(1,2,3,4,operation="mult")
print(s)                            # prints 24 (1 * 2 * 3 * 4)
```

When a final formal parameter of the form `**name` is present, it receives a dictionary containing all keyword arguments except for those corresponding to a formal parameter. This may be combined with a formal parameter of the form `*name` (described previously) but `*name` must occur before `**name`. I tend to see `*name` written as `*args` and `**name` as `**kwargs` For example:


```python
def calc(x, y, *args, **kwargs):
    if 'operation' not in kwargs:
        raise Exception("The 'operation' kwarg must be specified") 
    
    operation = kwargs['operation']
    if 'debug' in kwargs and kwargs['debug'] == True:
        print(operation)
    
    if(operation == "sum"):
        sum_args = 0
        for num in args:
            sum_args += num
        return x + y + sum_args
    elif(operation == "mult"):
        mult_args = 1
        for num in args:
            mult_args *= num
        return x * y * mult_args
    else:
        raise Exception('No such operation ' + operation)
        
s = calc(1,2,operation="sum", debug=True)
print(s)                            # prints 3 (1 + 2)
s = calc(1,2,operation="mult", debug=True)    
print(s)                            # prints 2 (1 * 2)
s = calc(1,2,3,4,operation="sum")
print(s)                            # prints 10 (1 + 2 + 3 + 4)
s = calc(1,2,3,4,operation="mult")
print(s)                            # prints 24 (1 * 2 * 3 * 4)
```


```python
# another example
def testargs(arg1, **kwargs):
    print("arg1={}".format(arg1))
    if kwargs is not None:
        for key, value in kwargs.items():
            print ("{}={}".format(key, value))
            
testargs("hello", radius=20, optimization_threshold=15)
```

## Classes

The syntax for defining classes in Python is as follows:


```python
class Greeter:

    # Constructor (yes, a weird format but you'll get used to it)
    def __init__(self, name):
        self.name = name  # Create an instance variable

    # Instance method
    def greet(self, loud=False):
        if loud:
            print('HELLO', self.name.upper())
        else:
            print('Hello', self.name)

g = Greeter('Fred')  # Construct an instance of the Greeter class
g.greet()            # Call an instance method; prints "Hello, Fred"
g.greet(loud=True)   # Call an instance method; prints "HELLO, FRED!"
print(g)
```

Just like in Java, you can override the `__str__` method (like Java's `toString`):


```python
class MyClass:
    # Constructor 
    def __init__(self, name):
        self.name = name  # Create an instance variable
        
    def __str__(self):
        # This is equivalent to the Java toString() override
        return "My name: " + self.name
    
mc = MyClass("Jon")
print(mc)
```

If you don't override the `__str__` method, then the default is to print out a memory reference for the class:


```python
class MyClass2:
    # Constructor 
    def __init__(self, name):
        self.name = name  # Create an instance variable
    
mc2 = MyClass2("Jon")
print(mc2)
```

Similar to JavaScript, you can add in class instance variables at anytime and anyplace. Yikes!


```python
# Playing around with classes
class DummyClass:
    def __init__(self, variable):
        self.testVar = variable
        

dummy = DummyClass(5)
print(dummy.testVar)

dummy.newVar = 7     # add in a new instance variable
print(dummy.newVar)
print(dummy)
print(vars(dummy))

dummy.test_str = "Can you believe we can do this? Who made the rules around here?"
print(dummy.test_str)
print(vars(dummy))
```

### Class Variables vs. Class Instance Variables

There is a **big difference** between *class variables* and *class instance variables* (see [Python docs](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables)), and it's easy to make a mistake here--especially if you're used to other object-oriented languages.

*Class variables* are variables shared across all instantiations of that class object--similar, for example, to static member variables in C#. In contrast, *class instance variables* are the more traditional member variables of a class. Let's look at an example.



```python
class Dog:

    kind = 'canine'         # class variable shared by all instances

    def __init__(self, name):
        self.name = name    # instance variable unique to each instance
        
d = Dog('Fido')
e = Dog('Buddy')
print(d.kind)                  # shared by all dogs
print(e.kind)                  # shared by all dogs
print(d.name)                  # unique to d
print(e.name)                  # unique to e
```

As discussed in [A Word About Names and Objects](https://docs.python.org/3/tutorial/classes.html#tut-object), shared data can have possibly surprising effects with involving [mutable objects](https://docs.python.org/3/glossary.html#term-mutable) such as lists and dictionaries. For example, the tricks list in the following code should not be used as a class variable because just a single list would be shared by all Dog instances:


```python
class Dog:

    tricks = []             # mistaken use of a class variable

    def __init__(self, name):
        self.name = name

    def add_trick(self, trick):
        self.tricks.append(trick)

d = Dog('Fido')
e = Dog('Buddy')
d.add_trick('roll over')
e.add_trick('play dead')
print(d.tricks)                # unexpectedly shared by all dogs
```

Correct design of the class should use an instance variable instead:


```python
class Dog:

    def __init__(self, name):
        self.name = name
        self.tricks = []    # creates a new empty list for each dog

    def add_trick(self, trick):
        self.tricks.append(trick)

d = Dog('Fido')
e = Dog('Buddy')
d.add_trick('roll over')
e.add_trick('play dead')
print(d.tricks)
print(e.tricks)
```

Here's another example. Does the code do what you think it should? Why or why not?


```python
class DummyClass2:
    class_var = "This is shared across all references."
    
    def __init__(self, msg):
        self.member_var = msg

dummy1 = DummyClass2("Example member variable")
dummy2 = DummyClass2("Hello World!")

print("dummy1: class_var='{}' member_var='{}'".format(dummy1.class_var, dummy1.member_var))
print("dummy2: class_var='{}' member_var='{}'".format(dummy2.class_var, dummy2.member_var))

DummyClass2.class_var = "Changed it!"

print("dummy1: class_var='{}' member_var='{}'".format(dummy1.class_var, dummy1.member_var))
print("dummy2: class_var='{}' member_var='{}'".format(dummy2.class_var, dummy2.member_var))

dummy1.member_var = "Goodbye!"
dummy2.member_var = "Goodnight!"
dummy2.class_var = "Changed it again!" # but now overrided the class variable as an instance class var for dummy2

print("dummy1: class_var='{}' member_var='{}'".format(dummy1.class_var, dummy1.member_var))
print("dummy2: class_var='{}' member_var='{}'".format(dummy2.class_var, dummy2.member_var))

DummyClass2.class_var = "Changed it a third time!"

print("dummy1: class_var='{}' member_var='{}'".format(dummy1.class_var, dummy1.member_var))
print("dummy2: class_var='{}' member_var='{}'".format(dummy2.class_var, dummy2.member_var))
```

### Dynamically Querying Objects for Member Variables and Functions
In some languages like C#, you can use [Reflection](https://docs.microsoft.com/en-us/dotnet/framework/reflection-and-codedom/dynamically-loading-and-using-types) to dynamically get information on a class instance like method and variable names and then programmatically access those variables. This is far simpler in Python using the `getattr` method. For example:


```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary
        
    def __str__(self):
        return "{} {}".format(self.name, self.salary)
    
    def dummy_method(self):
        print("Hello World!")

employee = Employee("Jon", "10,000")
print(employee)
print(employee.name)
print(getattr(employee, 'name')) # here, I am accessing the member variable employee via getattr

```

You can enumerate over all attributes of an object using `dir(obj)`:


```python
print(dir(employee))
```

If you only want member variables, use `vars(obj)`:


```python
print(vars(employee))

# Iterate through all the member variables and print their values
for var_name in vars(employee):
    print("{}: {}".format(var_name, getattr(employee, var_name)))
```

You can also do this for methods and invoke methods dynamically


```python
func = getattr(employee, 'dummy_method')
func()
```

# Misc

## Random


```python
import random

x = [random.randint(1,10) for i in range(1,10)]
print(x)
```


```python
seed = "myseed" # can be a number or string. when used, random will generate same series of numbers
random.seed(seed)
n = 10
x = [random.randint(1,n) for i in range(1,n)]
print(x)

random.seed() # clear the sead
y = [random.randint(1,n) for i in range(1,n)]
print(y)

random.seed() # clear the seed again but should be new random seq
y = [random.randint(1,n) for i in range(1,n)]
print(y)

random.seed(seed)
z = [random.randint(1,n) for i in range(1,n)]
print(z)
```


```python
random.seed("myseed")
x = [random.randint(1,10) for i in range(1,10)]
print(x)
```

# Future TODOs

- Add in how to import and use libraries (we are doing this implicitly all over the place but we should have some explicit examples of how to do this)
- The ml4a page has an "Intro to Python" Jupyter Notebook--skim it to see if there is anything relevant to pull over into this notebook


```python

```
