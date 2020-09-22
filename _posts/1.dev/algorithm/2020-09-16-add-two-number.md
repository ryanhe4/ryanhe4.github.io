---
layout: post
title: "[leetcode] Add Two Numbers"
date: 2020-09-16 10:00:00 +0900
categories: dev
tags: algorithm 
image: >-
  https://gaussian37.github.io/assets/img/math/algorithm/algorithm.png
---
**문제 주소**<br>
[https://leetcode.com/problems/add-two-numbers/](https://leetcode.com/problems/add-two-numbers/)

<!--more-->

* this is toc
{:toc}

![개요](/assets/img/dev/algorithm/2.PNG)

## 개요
`reverse order` 형태의 비어있지 않은 `ListNode` 두개가 주어집니다. 각각의 노드에는 단일 숫자가 들어있습니다. 
주어진 노드 두개의 값을 서로 더한 값을 새로운 노드로 만들어 반환하면 됩니다.

## 생각할 점
* 두 노드의 크기가 다른 경우
* 계산 중 올림이 발생한 경우

## 풀이
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* ret = nullptr;
        ListNode* left = l1;
        ListNode* right = l2;
        ListNode* head;
        
        bool overflow= false;
        
        int count = 0;
        int count2 = 0;
        while(l1) {
            l1= l1->next;
            count++;
        }
        
        while(l2) {
            l2= l2->next;
            count2++;
        }
        
        bool lr = count >= count2 ? true : false; // left가 클경우 true 아니면 false
        
        if (lr) {
                while(left ) {
            int sum;
            if(left == nullptr) {
                sum = right->val;    
            }  
            else if(right == nullptr) {
                sum = left-> val;
            }
            else {
            sum = left->val + right-> val;
            }
            
            if(overflow) {
                sum = sum+1;
                overflow = false;
            }
            if(sum >= 10 ) {
                sum = sum-10;
                overflow = true;
            }
            
            if(ret ==nullptr){
                ret =new ListNode(sum);
                head = ret;
            }else {
                ret->next = new ListNode(sum);
                ret= ret->next;
            }
 
            left = left->next;
            if(right) right = right->next;
        }
        }
        else {
                while(right ) {
            int sum;
            if(left == nullptr) {
                sum = right->val;    
            }  
            else if(right == nullptr) {
                sum = left-> val;
            }
            else {
            sum = left->val + right-> val;
            }
            
            if(overflow) {
                sum = sum+1;
                overflow = false;
            }
            if(sum >= 10 ) {
                sum = sum-10;
                overflow = true;
            }
            
            if(ret ==nullptr){
                ret =new ListNode(sum);
                head = ret;
            } else {
                ret->next = new ListNode(sum);
                ret= ret->next;
            }   
            
            if(left) left = left->next;
            right = right->next;
        }
        }
    
        if(overflow) {
            ret->next = new ListNode(1);
            ret= ret->next;
        }
        return head;
    }
};
```
우선 저는 Case를 두가지로 나누었습니다. `left` 와 `right`가 보유하고있는 node의 갯수를 기준으로 left가 클경우 left을 기준으로, right가 클 경우 right를 기준으로해서 두개의 크기가 다른 경우를 처리하였습니다.
덧셈 계산중 노드의 포인터가 nullptr이 나오면 0을 더하였고, `bool overflow`를 이용하여 값이 10이 넘어가면 10을 빼고 overflow를 설정하여 다음 반복에서 처리하도록 하였습니다. 마지막 노드에서 올림이 발생하면
마지막 값의 Node에 1을 올리는 식으로 해당 문제를 구현하였습니다.

## 마무리
문제를 푸는데 더 간단하게 할 수 있을 것 같다는 생각이 들었습니다. left와 right 사이에 중복되는 부분이 많아서 해당 부분을 따로 처리하지 않고 같이 처리하면 될 것 같습니다.    

    


