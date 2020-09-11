---
layout: post 
title: "Linux 기본 명령어 1"
date: 2020-08-25 15:52:00 +0900
categories: study
tags: linux 
image: assets/img/blog/steve-harvey.jpg
---

Linux 기본 명령어

<!--more-->

* toc table
{:toc}

# 01. 런레벨(run level)

```python
0   halt, poweroff
1   single user mode
2   (TUI) multi-user mode without NFS
3   (TUI) multi-user mode with NFS
4   not defined
5   (GUI) multi-user mode with NFS
6   reboot
```
런레벨 확인 
```
# who -r
```
런레벨 조정
```console
# halt, # poweroff, #  reboot ,"(단일)"
# init 3, # shutdown -h, "(다중)"
```
# 02. 언어 확인(language confirm)
```
# echo $LANG (또는 # locale)
```
언어 변경(language change)
```python
(임시) # export LANG=en_US.UTF-8|ko_KR.UTF-8
(영구) # localectl set-locale LANG=ko_KR.UTF-8
```
# 03. 쉘 프롬프트
 ```python
 [root@linux2XX ~] #
 ```
 명령어 호출 
 ```python
 # ls -a /var
 (프롬프트, 명령어, 옵션, 인자...)
 ```
# 04. 관리자 암호 변경
1) terminal 명령어
```
# passwd fedora
```
2) GRUB menu 이용 root 사용자 암호 초기화하기
  ```
  0 reboot
  1 GRUB Menu
  2 적당한 커널 선택 -> e -> linux16 라인 이동 -> <END> -> init=/sbin/bash -> <CTRL + Z>, <CTRL + x>
  3 # mount -o remount,rw /
  4 # passwd root
  5 강제 reboot| exec /sbin/init
  ```
# 05. 제어 문자(Control Character)
```python
* <CTRL + C> # interrupt
* <CTRL + D> # 파일의 끝|exit
```
# 도움말과 암호 변경
> man CMD

 ```console
 # man ls
 # man -f passwd(# mandb, 검색이 안될 경우 사용)
 # man -k calendar
 # man 4 passwd 
 passwd(5) : 5번 섹션 => # man 5 passwd
 passwd(1) : 1번 섹션 => # man 1 passwd 
 ```
> passwd CMD

 ```
 # passwd root
 # passwd fedora
```
[참고] 메뉴얼 섹션

```python
■ Linux Manual Section
---------------------------------------------------------
Section 1 : 사용자 명령(실행가능한 명령 및 쉘 프로그램)
Section 2 : 시스템 호출(사용자 공간에서 호출된 커널 루틴)
Section 3 : 라이브러리 기능(프로그램 라이브러리에서 제공)
Section 4 : 특수 파일(예: 장치 파일)
Section 5 : 파일 형식(많은 구성 파일 및 구조의 경우)
Section 6 : 게임(오락 프로그램용 섹션)
Section 7 : 범례, 표준 및 기타(프로토콜, 파일시스템)
Section 8 : 시스템 관리 및 권한 명령(유지 보수 작업)
Section 9 : 리눅스 커널 API(내부 커널 호출)
---------------------------------------------------------

[예] 시스템 관리자가 알아 두어야 하는 매뉴얼 섹션
- Section 1 : 명령어 및 데몬등에 대한 매뉴얼
- Section 5 : 운영체제 설정 파일 및 데몬의 설정 파일 매뉴얼
- Section 8 : 관리명령어 매뉴얼

[예] 개발자가 알아 두어야 하는 매뉴얼 섹션
- Section 2 : 시스템 콜 함수 매뉴얼
- Section 3 : 일반 함수 매뉴얼
- Section 9 : 리눅스 커널 API 매뉴얼
```
# SSH
원격 접속을 위한 명령어
```console
# ssh fedora(:username)@localhost(:address)
```
