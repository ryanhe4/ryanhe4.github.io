---
layout: post
title: "Linux 기본 명령어 6"
date: 2020-09-09 09:32:00 +0900
categories: study
tags: linux 
---
리눅스 명령어 정리 입니다.

<!--more-->

* toc label
{:toc}

## 쉘의특성2
**메타 캐릭터(Shell Metacharacter)**<br>
미리 정의된 특수한 의미가 있는 캐릭터, `''(quote)` `""(double quote)` ``(back quote)` `\\` ;

**명령어 히스토리(Command History)**<br>
히스토리 사용 변수들 <br>
HISTFILE=512<br>
HISTFILE=$HOME/.bash_history<br>
HISTFILESIZE=512<br>
HISTTIMEFORMAT="%F %T    "

**엘리어스(alias)**<br>
```console
# alias cp='cp -i'
# alias 
# unalias cp
```
**환경 파일**
```console
/etc/profile
$HOME/.bash_profile
$HOME/.bashrc
```

## 프로세스 관리
* PID: 프로세스가 시작할 때 할당받는 프로세스 식별번호
* Deamon: 시스템을 위해 또는 서비스를 위해 백그라운드에서 동작하는 프로세스

>프로세스 정보 (/proc/PID/*)
{:.lead}

`PID`, `PPID`, `Contorl Terminal(TTY)`등 <br>
>프로세스 관리1
{:.lead}
* 프로세스 실행
    - foreGround `# ls`
    - backGround `# ls &`

    **`백그라운드`로 프로세스를 실행하는 경우**
    1. 시간이 오래 걸리는 프로그램 실행(e.g. /root/bin/backup.sh &)
    1. GUI 환경을 사용하는 프로그램

* **프로세스 확인**
    ```console
    # pa aux | grep rsyslogd
    # ps -ef | grep rsyslogd
    ```
* **프로세스 종료**
    ```console
    # kill -1 PID   (Daemon의 PID번호, 재기동)
        httpd
        httpd.conf(수정)
    # kill -2 PID   (# kill -INT PID, 인터럽트 시그널, Ctrl+C)
    # kill -9 PID   (# kill -KILL PID, 강제종료)
    # kill PID (# kill -15 PID(정상종료)
    ```
    {:.note}
    
    killall CMD, pkill CMD
    
    
>프로세스 관리2 (JOB 관리)
{:.lead}

* **잡 실행**
    ```console
    fg) # ls
    bg) # ls &  
    ```
* **잡 확인**
    ```console
    # jobs
    # fg %1
    # bg %1
    CTRL + Z
    ```
* **잡 종료**
    ```console
    # kill %1
    ```
  
>프로세스 모니터링
{:.lead}

프로세스 모니터링에 `top명령어`를 사용하는데 해당 명령어의 해석이 중요하다.
```console
# top   (# gnome-system-monitor)
# top -u user01
```  
1. **정렬기능**: c`P`u, `M`em(top 상태에서 강조된 키워드 입력)<br>
1. **첫번째 줄**<br>
    * `uptime` 출력, `최소 300일`에 한번씩은 서버를 재부팅
    * `load average`, 1분/5분/15분 부하측정치 (나누기) CPU 개수 >= 1
1. **두번째 줄**<br>
    * Task: 실행중인 프로세스
    * running: 실행중인 
    * sleeping: 대기중인 상태
    * stopped: 정지
    * zombie: 제대로 종료되지 않은 프로세스 
    * 좀비 프로세스 검색 방법
        ```console
        # ps -elf | awk '$2 == "Z" {print $0}'
        ```        
1. **세번째 줄**<br>
    CPU상태를 나타냄<br>
    * %us(usr), %sy(sys), `%id(idle): 유휴시간`, %wa(wait)
    * %us + %sy >= `80%`이면 CPU증설 고려     
1. **네번째 줄**<br>
    `total` / `free` 부분 중요
    
>서버 리소스 모니터링 툴
{:.lead}

* top/ htop(따로 설치): CPU, MEM
* iotop: DISK
* ntop(따로 설치): Network

>lsof 명령어
{:.lead}

프로세스에 의해 열려진 파일들에 대한 정보를 보는 명령어
```console
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
```console
# pmap PID
```
명령어 형식
{:.figcaption}

>pstree 명령어
 {:.lead}

실행중인 프로세스 상태를 트리 구조로 보여주는 명령어
```console
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

```console
# nice -(-20~19) CMD
# renice (-20~20) PID
```
명령어 형식
{:.figcaption}

백업 스크립트/ 데이터 수집 스크립트 실행시<br>
CPU 많이 점유하는 프로세스가 존재하는 경우
{:.note}
```console
# nice -10 /root/bin/backup.sh &
```

```console
# renice 10 PID
```
## 원격접속 & 파일전송
>sCMD(ssh, scp ,sftp)
{:.lead}

* **ssh 명령어**<br>
    원격 접속 명령어
    ```console
     # ssh IP
     # ssh IP CMD
     ```
* **scp 명령어**<br>
    파일전송 명령어
    ```console
    # scp source destination
    # scp [-r] file1 172.16.6.249:/test
    # scp [-r] 172.16.6.249:/test/file1 /test
    ```
* public key authentication
    * server A > server B 접속시 
    ```console
    # ssh-keygen  -t rsa
    # ssh-copy-id -i ~/.ssh/id_rsa.pub root@serverB(ip)
    ``` 
    
<clap-button></clap-button>    

{:.read-more}