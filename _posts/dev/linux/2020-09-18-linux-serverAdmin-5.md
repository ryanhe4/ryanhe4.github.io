---
layout: post
title: "리눅스 서버 관리5 - 사용자 그룹 관리 & 작업 스케줄링"
date: 2020-09-18 09:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
사용자 그룹 관리(useradd,del,mod) , 작업 스케줄링(crontab, at)
<!--more-->

* toc part
{:toc}

## 사용자 관리
### 사용자  정보 파일
* /etc/passwd

> root:`x`:0:0:root:/root:/bin/bash

|필드      |설명|
|---------|--------------------------------|
|root|사용자 이름|
|x|사용자 암호(보안상 /etc/shadow 파일에 암호를 옮겨 놓았음)|
|0|사용자 아이디(UID)|
|0|그룹 아이디(GID), 사용자의 주 그룹(Primary Group)|
|root|설명 정보(Comment)|
|/root|홈 디렉토리|
|/bin/bash| 로그인 쉘|

* /etc/shadow
* /etc/login.defs

### 사용자 관리 명령어
#### **useradd** CMD
사용자 정보 추가 명령어
```console
# useradd user01
# passwd user01
# useradd -u 1000 -g -c "" -d /home/user01 -s /bin/bash user01
# useradd -M -d /oracle oracle
``` 
#### usermod CMD
사용자 정보 변경 명령어
```console
# usermod -s /bin/csh usr01
# usermod -u 1001 user01
# usermod -; user02 -d /home/user02 -m user01
# groupmod -n user02 user01
```
> `# cat /etc/shlls` 쉘 확인

#### userdel CMD
사용자 삭제 명령어
```console
# userdel user01
# userdel -r user01
```

> `참고` /etc/skel/*
  
1. /etc/skek/* 의 내용 
1. `useradd` 명령어 수행 
1. /home/사용자/* 내용 복사

> `참고` 사용자 추가 스크립트
```
# useradd user01
# echo 암호 | passwd --stdin user01
```

## 그룹 관리
### 그룹(group)
사용자의 묶음
* 한명의 사용자는 하나 이상의 그룹에 속해야 한다.
* 사용자가 속한 그룹의 종류는 주 그룹(Primary Group), 부 그룹(Secondary Group)이 있다.
* 한명의 사용자는 한개의 주 그룹과 31개의 부 그룹에 최대로 속할 수 있다. 

### 그룹 정보 파일
* /etc/group 파일
* /etc/login.defs

### 그룹 정보 관리 명령어
#### groupadd CMD
```console
# groupadd class1
```
#### groupdmod CMD
```console
# groupmod -u 2001 user01
# groupmod -n class3 class1
```
#### groupdel CMD
```console
# groupdel class1
```
## 패스워드 에이징
* /etc/shadow(Last Change:MIN:MAX:WARN:INACTIVE:EXPIRE:)

### chage CMD (개인)
```console
# chage -l user01
# chage -M 30 -W 7 user01
# chage -E 2020-12-31 user01
```    
### /etc/login.defs 전역설정
* PASS_MAX_DAYS 30
* PASS_WARN_AGE 7

> oracle/wasuser 추가하는 방법

## 잡 스케줄링
### at CMD(atd)
요청 명령을 선택 시간에 `한 번` 실행
```console
# systemctl restart atd

# at 1300   (# at now + 3 mins)
# at -l     (# atq)
# at -r N   (# atrm N)
```

### crontab CMD(crond)
같은 작업을 주기적으로 반복 실행되도록 하는 작업 스케줄용 데몬 <br>
![cron 형식](https://miro.medium.com/max/670/1*ukNvgqV-HTHTebPHZMFNgg.png)
```console
# systemctl restart crond

# crontab -e
# crontab -l
# crontab -r
```

> 백업 스크립트 + crontab
 
```console
# crontab -e
0 3 1 * * 6 /root/bin/backup.sh

# vi /root/bin/backup.sh
* date '%m%d'
```