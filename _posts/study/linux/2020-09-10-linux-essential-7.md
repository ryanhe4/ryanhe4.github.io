---
layout: post
title: "Linux 기본 명령어 7"
date: 2020-09-10 09:16:00 +0900
categories: study
tags: linux 
---
리눅스 필수 명령어
<!--more-->

* toc part
{:toc}

## 프로세스 모니터링
>서버 리소스 모니터링 툴
{:.lead}

* top/ htop(따로 설치): CPU, MEM
* iotop: DISK
* ntop(따로 설치): Network

>lsof 명령어
{:.lead}

프로세스에 의해 열려진 파일들에 대한 정보를 보는 명령어
```bash
# lsof
# lsof /tmp    //파일이름 지정
# lsof -c sshd //데몬 지정
# lsof -i      //소켓정보 검색

# lsof | grep 'sshd' //grep을 통한 검색
```
명령어 형식
{:.figcaption}

>pmap 명령어
{:.lead}

프로세스가 사용하고 있는 메모리의 주소를 확인 하는 명령어
```bash
# pmap PID
```
명령어 형식
{:.figcaption}

>pstree 명령어
 {:.lead}

실행중인 프로세스 상태를 트리 구조로 보여주는 명령어
```bash
# pstree PID
# pstree -alup PID
```
명령어 형식
{:.figcaption}

>nice/renice 명령어
{:.lead}

프로세스의 `우선순위`를 조정하는데 사용하는 명령어<br>
**프로세스 우선순위** <br>
프로세스가 운영체제의 CPU를 선점할 수 있는 권한
 
* nice 명령어: 프로그램을 실행할 때 프로세스의 우선순위를 변경하는 명령어
* renice 명령어: 실행중인 프로그램의 우선순위를 조정하는 명령어

```bash
# nice -(-20~19) CMD
# renice (-20~20) PID
```
명령어 형식
{:.figcaption}

백업 스크립트/ 데이터 수집 스크립트 실행시<br>
CPU 많이 점유하는 프로세스가 존재하는 경우
{:.note}
```bash
# nice -10 /root/bin/backup.sh &
```

```bash
# renice 10 PID
```
## 원격접속 & 파일전송
>sCMD(ssh, scp ,sftp)
{:.lead}

* **ssh 명령어**<br>
    원격 접속 명령어
    ```bash
     # ssh IP
     # ssh IP CMD
     ```
* **scp 명령어**<br>
    파일전송 명령어
    ```bash
    # scp source destination
    # scp [-r] file1 172.16.6.249:/test
    # scp [-r] 172.16.6.249:/test/file1 /test
    ```
* public key authentication
    * server A > server B 접속시 
    ```bash
    # ssh-keygen  -t rsa
    # ssh-copy-id -i ~/.ssh/id_rsa.pub root@serverB(ip)
    ``` 
  
## 리눅스 서버 관리자 
>디렉토리 구조와 용도
{:.lead}

**시스템 디렉토리**
|디렉토리명|설명|
|:-------|:----------------------------------------------|
|/usr|대부분의 프로그램에 설치되는 공간 , `/bin`, '/share' 등|
|/etc||
|/mnt||
|/lib|프로그램들의 각종 라이브러리 들이 존재|
|/dev|시스템의 각종 디바이스들의 목록이 들어 있는 디렉토리|
|/proc|시스템의 프로세스, 프로그램 정보 , 하드웨어 정보|
|/bin|기본 명령어들이 모여 있는 디렉토리|
|/boot|리눅스 커널이 저장되어 있는 디렉토리|
|/var|시스템에서 사용되는 가변적인 파일들이 저장|   
|/tmp|임시 파일들을 위한 디렉토리|      
