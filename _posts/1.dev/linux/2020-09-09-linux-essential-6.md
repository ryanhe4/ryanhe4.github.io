---
layout: post
title: "Linux 기본 명령어 6"
date: 2020-09-09 09:32:00 +0900
categories: dev
tags: linux 
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg 
---
리눅스 명령어 정리 입니다.

<!--more-->

* toc label
{:toc .large-only}

## 쉘의특성
**메타 캐릭터(Shell Metacharacter)**<br>
미리 정의된 특수한 의미가 있는 캐릭터, `''(quote)` `""(double quote)` ``` ``(back quote)``` 등

**명령어 히스토리(Command History)**<br>
히스토리 사용 변수들 <br>
* HISTFILE=512<br>
* HISTFILE=$HOME/.bash_history<br>
* HISTFILESIZE=512<br>
* HISTTIMEFORMAT="%F %T    //탭, 공백4칸"

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
* PID: 프로세스가 시작할 때 할당받는 프로세스 식별번호를 의미합니다.
* Deamon: 시스템을 위해 또는 서비스를 위해 백그라운드에서 동작하는 프로세스

**프로세스 정보 (/proc/PID/*)**

`PID`, `PPID`, `Contorl Terminal(TTY)`등 <br>

### 프로세스 관리 명령어
**프로세스 실행**
- foreGround `# ls`
- backGround `# ls &`

**`백그라운드`로 프로세스를 실행하는 경우**
1. 시간이 오래 걸리는 프로그램 실행(e.g. /root/bin/backup.sh &)
1. GUI 환경을 사용하는 프로그램

**프로세스 확인**
```console
# pa aux | grep rsyslogd
# ps -ef | grep rsyslogd
```
**프로세스 종료**
```console
# kill -1 PID   (Daemon의 PID번호, 재기동)
    httpd
    httpd.conf(수정)
# kill -2 PID   (# kill -INT PID, 인터럽트 시그널, Ctrl+C)
# kill -9 PID   (# kill -KILL PID, 강제종료)
# kill PID (# kill -15 PID(정상종료)
```

프로세스 종료 명령어에는 `killall CMD`, `pkill CMD` 도 있습니다.
      
### 프로세스 JOB 관리
**잡 실행**
```console
fg) # ls
bg) # ls &  
```

**잡 확인**
```console
# jobs
# fg %1
# bg %1
CTRL + Z
```
**잡 종료**
```console
# kill %1
```
  
### 프로세스 모니터링
프로세스 모니터링에 `top` 명령어를 사용하는데 해당 명령어의 해석이 중요하다.
```console
# top   (# gnome-system-monitor)
# top -u user01

top - 13:24:50 up 2 days,  1:18,  1 user,  load average: 0.13, 0.04, 0.01
Tasks: 201 total,   3 running, 198 sleeping,   0 stopped,   0 zombie
%Cpu0  :  0.4 us,  8.0 sy,  0.0 ni, 90.8 id,  0.0 wa,  0.0 hi,  0.8 si,  0.0 st
%Cpu1  :  0.4 us,  3.3 sy,  0.0 ni, 95.6 id,  0.0 wa,  0.0 hi,  0.7 si,  0.0 st
%Cpu2  :  0.0 us,  3.1 sy,  0.0 ni, 96.1 id,  0.0 wa,  0.0 hi,  0.8 si,  0.0 st
%Cpu3  :  0.0 us,  5.8 sy,  0.0 ni, 94.2 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   1963.4 total,    154.8 free,    868.0 used,    940.7 buff/cache
MiB Swap:    975.0 total,    894.0 free,     81.0 used.    854.9 avail Mem 

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                       
   1215 root      20   0 1024984  58944  33432 S  36.4   2.9   3:09.25 /usr/bin/qterminal                                            
    571 root      20   0 1005120  90612  32544 S  21.9   4.5   8:27.84 /usr/lib/xorg/Xorg :0 -seat seat0 -auth /var/run/lightdm/roo+ 
    980 root      20   0 1024820  62264  34392 S   7.3   3.1   2:19.19 xfwm4                                                         
   1086 root      20   0  294576  24676  14788 S   2.6   1.2  11:37.54 /usr/bin/vmtoolsd -n vmusr --blockFd 3                        
    972 root      20   0  168140   4372   4332 S   2.0   0.2   0:17.36 /usr/libexec/at-spi2-registryd --use-gnome-session            
     10 root      20   0       0      0      0 I   1.7   0.0   1:15.61 [rcu_sched]                                                   
   1004 root      20   0  234268  11820   7536 S   1.3   0.6   0:03.30 xfsettingsd                                                   
   1018 root      20   0  522772  18204  11988 S   1.3   0.9   3:53.68 /usr/lib/x86_64-linux-gnu/xfce4/panel/wrapper-2.0 /usr/lib/x+ 
    448 root      20   0  162716   5284   4488 S   0.7   0.3  11:30.80 /usr/bin/vmtoolsd                                             
    961 root      20   0    7168   3680   3324 S   0.7   0.2   0:03.09 /usr/bin/dbus-daemon --config-file=/usr/share/defaults/at-sp+ 
    602 postgres  20   0  211112   8228   7764 S   0.3   0.4   0:04.18 postgres: 12/main: walwriter                                  
    925 root      20   0    7588   4276   3372 S   0.3   0.2   1:10.98 /usr/bin/dbus-daemon --session --address=systemd: --nofork -+ 
  23734 root      20   0       0      0      0 I   0.3   0.0   0:01.33 [kworker/0:1-events]                                          
  23853 root      20   0    7656   3884   3144 R   0.3   0.2   0:00.02 top c 1                                                       
      1 root      20   0  169144   7788   5912 S   0.0   0.4   0:06.10 /sbin/init splash                                             
      2 root      20   0       0      0      0 S   0.0   0.0   0:00.59 [kthreadd]                                                    
      3 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 [rcu_gp]                                                      
      4 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 [rcu_par_gp]                                                  
      6 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 [kworker/0:0H-kblockd]                                        
      8 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 [mm_percpu_wq]                                                
      9 root      20   0       0      0      0 S   0.0   0.0   0:01.56 [ksoftirqd/0]                                                 
     11 root      rt   0       0      0      0 S   0.0   0.0   0:00.44 [migration/0]                                                 
     13 root      20   0       0      0      0 S   0.0   0.0   0:00.00 [cpuhp/0]                                                     
     14 root      20   0       0      0      0 S   0.0   0.0   0:00.02 [cpuhp/1]                                                     
     15 root      rt   0       0      0      0 S   0.0   0.0   0:00.52 [migration/1]                                                 
     16 root      20   0       0      0      0 S   0.0   0.0   0:02.45 [ksoftirqd/1]                                                 
     18 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 [kworker/1:0H-kblockd]                                        
     19 root      20   0       0      0      0 S   0.0   0.0   0:00.00 [cpuhp/2]                                                     
     20 root      rt   0       0      0      0 S   0.0   0.0   0:00.67 [migration/2]                                                 
     21 root      20   0       0      0      0 S   0.0   0.0   0:00.82 [ksoftirqd/2]                                                 
     23 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 [kworker/2:0H-kblockd]                                        
     24 root      20   0       0      0      0 S   0.0   0.0   0:00.00 [cpuhp/3]                                                     
     25 root      rt   0       0      0      0 S   0.0   0.0   0:00.52 [migration/3]  
```  
**정렬기능**: c`P`u, `M`em(top 상태에서 강조된 키워드 입력)<br>
**첫번째 줄**
* `uptime` 출력, `최소 300일`에 한번씩은 서버를 재부팅
* `load average`, 1분/5분/15분 부하측정치 (나누기) CPU 개수 >= 1
**두번째 줄**
* Task: 실행중인 프로세스
* running: 실행중인 
* sleeping: 대기중인 상태
* stopped: 정지
* zombie: 제대로 종료되지 않은 프로세스 
* 좀비 프로세스 검색 방법
```console
# ps -elf | awk '$2 == "Z" {print $0}'
```        
**세번째 줄**<br>
CPU상태를 나타냅니다. <br>
* %us(usr), %sy(sys), `%id(idle): 유휴시간`, %wa(wait)
* %us + %sy >= `80%`이면 CPU증설 고려     
**네번째 줄**<br>
`total` / `free` 부분 중요
    
서버 리소스 모니터링 툴{:.note}
top/ htop(따로 설치): CPU, MEM

iotop: DISK

ntop(따로 설치): Network

**lsof 명령어**

프로세스에 의해 열려진 파일들에 대한 정보를 보는 명령어입니다.
```console
# lsof
# lsof /tmp    //파일이름 지정
# lsof -c sshd //데몬 지정
# lsof -i      //소켓정보 검색

# lsof | grep 'sshd' //grep을 통한 검색
```
명령어 형식
{:.figcaption}

**pmap 명령어**

프로세스가 사용하고 있는 `메모리의 주소`를 확인 하는 명령어입니다.

```console
# pmap PID
```
명령어 형식
{:.figcaption}

**pstree 명령어**

실행중인 프로세스 상태를 `트리 구조`로 보여주는 명령어 입니다.
```console
# pstree PID
# pstree -alup PID
```
명령어 형식
{:.figcaption}

**nice/renice 명령어**

프로세스의 `우선순위`를 조정하는데 사용하는 명령어 입니다.<br>

**프로세스 우선순위** <br>
프로세스가 운영체제의 CPU를 선점할 수 있는 권한을 의미합니다.
 
* nice 명령어: 프로그램을 실행할 때 프로세스의 우선순위를 변경하는 명령어
* renice 명령어: 실행중인 프로그램의 우선순위를 조정하는 명령어

```console
# nice -(-20~19) CMD
# renice (-20~20) PID
```
명령어 형식
{:.figcaption}

* 백업 스크립트/ 데이터 수집 스크립트 실행할 때와 CPU를 많이 점유하는 프로세스가 존재하는 경우
```console
# nice -10 /root/bin/backup.sh &
# renice 10 PID
```

## 원격접속 & 파일전송
### sCMD(ssh, scp ,sftp)

**ssh 명령어**<br>
RSA 암호화 통신을 통해 원격 접속하는 명령어 입니다.
```console
 # ssh IP
 # ssh IP CMD
 ```
**scp 명령어**<br>
암호화를 통한 파일전송 명령어 입니다.
```console
# scp source destination
# scp [-r] file1 172.16.6.249:/test
# scp [-r] 172.16.6.249:/test/file1 /test
```
**public key authentication**
* server A > server B 접속시 자신의 ssh키(server A)를 다른서버쪽(serverB)에 등록시켜 추가적인 암호인증 없이 서버에 접속할 수 있습니다.
```console
# ssh-keygen  -t rsa
# ssh-copy-id -i ~/.ssh/id_rsa.pub root@serverB(ip)
``` 
