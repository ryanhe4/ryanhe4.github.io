---
layout: post 
title: "Linux 기본 명령어 3 - 관리, 파일"
categories: dev
tags: linux 
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
date: 2020-08-27 09:33:00 +0900
image: assets/img/blog/steve-harvey.jpg
---
Linux 기본 명령어

<!--more-->

* toc table
{:toc}

# 기타 관리용 명령어

## su CMD (switch user)
* 일반사용자   ->    다른 일반사용자
* 일반사용자   ->    관리자
* 관리자       ->    일반사용자

```
# su [user]   : 환경변수가 바뀌지않음 ($PATH 등)
# su - [user] : 환경변수까지 바뀜
```

>**스위칭 후 id,pwd 명령어로 스위칭 확인 필요**
 
**[참고]** sudo CMD (superuser do,/etc/sudoers, /etc/shdoers.d/\*)  
관리자 권한으로 실행

```
# sudo CMD
# sudo -l    : 사용가능한 명령어의 종류
# sudo su - root
# sudo -i    : 관리자로 로그인(일반 사용자 암호 입력, 환경변수 일부만 변경됨)
```

## id CMD (/etc/passwd)

## groups CMD(/etc/passwd, /etc/group)

## last CMD(/var/log/wtmp)
 
 ```
 # last
 # last -f /var/log/wtmp.#
 ```

## lastlog CMD(/var/log/last.log)
## lastb CMD(/var/log/btmp)
```
# lastb | grep ssh | wc -i 
```

## who(/var/run/utmp) , last  
## w CMD
**# ps -f -u username**: 접속확인

## while CMD

## vim commands

# 파일의 종류
## 일반 파일(Ordinary file)
구조 : inode + data Block
  
## 디렉토리 파일(Directory file)

```
.(현재폴더)
..(상위폴더)
```
## 링크 파일(Link file)
 
* **하드 링크 파일(Hard Link File)**<br>
inode 링크 방식, 원복 삭제시에도 사용가능
```console
# ln file1 file2
```
* 심볼릭 링크 파일(Symbolic Link File= soft link file)
```console
# ln -s file1 file2
```
    
>하드링크와 심볼릭 링크의 차이점<br>
- data block link 방식, 원본 삭제시 사용불가
- 파일시스템을 넘어서 링크가능
- 디렉토리에 링크 가능
- 디렉토리 마이그레이션 `/was -> /zeus`
- 여러가지 서비스 디렉토리 통합
- 오픈 소스 프로그램 형태의 소스 버전 관리

```console
# ln -s file1 file2
```

## 디바이스 파일
* 용어: 커널(/dev/*) - 디바이스 드라이버 - 디바이스<br>
    - 블럭 디바이스 파일(block 단위 I/O, 4k, 8k ...)
    - 캐릭터 디바이스 파일(바이트 단위 I/O, 512byte)

