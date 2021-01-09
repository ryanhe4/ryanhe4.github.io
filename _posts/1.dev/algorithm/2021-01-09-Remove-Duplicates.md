---
layout: post
title: "[leetcode] Remove Duplicates from Sorted Array"
date: 2021-01-09 15:21:00 +0900
categories: dev
tags: algorithm
image: >-
    https://gaussian37.github.io/assets/img/math/algorithm/algorithm.png
---
**문제 주소**<br>
[https://leetcode.com/problems/remove-duplicates-from-sorted-array/](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

<!--more-->

* this is toc
{:toc .large-only}

![개요](/assets/img/dev/algorithm/26.PNG)

## 개요
정렬된 형태의 정수값을 가진 배열이 주어집니다. 해당 배열내에서 중복된 값을 제거하고 배열의 크기를 반환하면 됩니다.  

### 제약사항
* 0 <= nums.length <= 3 * 10^4
* -10^4 <= nums[i] <= 10^4
* nums is sorted in ascending order.

## 생각할 점
1. 배열이 `&`, 레퍼런스인자로 넘어오기 때문에 배열내에서 실제로 제거해야합니다. 
1. 반환되는 값은 삭제하고 남은 배열의 크기입니다. 채점할 때 이 크기를 통해 인자의 배열을 순회하기 때문입니다. 반환 되는 값을 중복되는 수로 착각했었습니다.  

## 풀이
```cpp
class Solution {
public:
    static int removeDuplicates(vector<int> &nums) 
    {
        int prevNum = 10001;
        int ret = 0;

        for (auto it = begin(nums); it!=end(nums);) {
            if (*it==prevNum) {
                prevNum = *it;
                it = nums.erase(it);
            }
            else {
                ret++;
                prevNum = *it;
                ++it;
            }
        }
        return ret;
    }
};

```
구현은 실제로 간단합니다. 배열의 이터레이터를 순회하며 이전 값과 현재 값이 같은 경우 해당 값을 삭제해주면 됩니다. 저 처럼 리턴 값이 무엇인지 헷갈리지 않으면 쉽게 해결할 것같습니다.

    


