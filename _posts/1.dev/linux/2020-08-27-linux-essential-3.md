---
layout: post 
title: "Linux 기본 명령어 3 - 관리, 파일"
categories: dev
tags: linux 
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
date: 2020-08-27 09:33:00 +0900
---
Linux 기본 명령어

<!--more-->

* toc table
{:toc .large-only}

## 기타 시스템 관리용 명령어

**su CMD (switch user)**

해당 명령어는 다음과 같이 현재 사용자를 변경할때 사용합니다. 변경 시에는 id/pass 가 필요합니다.
* 일반사용자   ->    다른 일반사용자
* 일반사용자   ->    관리자
* 관리자      ->    일반사용자

```
# su [user]   : 환경변수가 바뀌지않음 ($PATH 등)
# su - [user] : 환경변수까지 바뀜
```
 
**sudo CMD**<br>
유저를 변경하지 않고 관리자 권한으로 실행 하는 명령어 입니다.<br> (superuser do,/etc/sudoers, /etc/shdoers.d/\*)
```
# sudo CMD
# sudo -l    : 사용가능한 명령어의 종류
# sudo su - root
# sudo -i    : 관리자로 로그인(일반 사용자 암호 입력, 환경변수 일부만 변경됨)
```

**id CMD (/etc/passwd)**
```console
# id
uid=0(root) gid=0(root) groups=0(root)
```

**last CMD(/var/log/wtmp)**
 ```
 # last
 # last -f /var/log/wtmp.#
 ```
`last`는 wtmp의 내용을 해석하여 출력해주는 함수 입니다. wtmp는 시스템 접속기록을 보관합니다.

**lastlog CMD(/var/log/last.log)**
```console
#lastlog
사용자이름       포트     어디서           최근정보
root             pts/2    192.168.20.50    월 11월 23 12:53:29 +0900 2020
```
`lastlog`는 사용자의 목록과 마지막 로그인 정보를 출력합니다.

**lastb CMD(/var/log/btmp)**
```
# lastb
blawrg   ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
usmc8892 ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
blawrg   ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
usmc8892 ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
Eagle11  ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
felux    ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
ps-aux   ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
maleus   ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
Eagle11  ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
ps-aux   ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
felux    ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
maleus   ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
maleus   ssh:notty    127.0.0.1        Wed Dec  2 16:26 - 16:26  (00:00)
```
`lastb` 명령어는 접속 실패 기록을 보여주는 명령어입니다.


**접속 확인 명령어**
* who(/var/run/utmp), last  
* w CMD**
* `# ps -f -u username`  

## 파일의 종류
**일반 파일(Ordinary file)**<br>
inode + data Block의 구조로 이루어진 파일입니다.
  
**디렉토리 파일(Directory file)**
```
.(현재폴더)
..(상위폴더)
```
다양한 파일을 포함할 수 있는 윈도우에서의 폴더와 비슷한 디렉토리 파일 입니다.

**링크 파일(Link file)**
링크파일이란 다른 파일을 가리키는 파일입니다. 

* 하드 링크 파일(Hard Link File)<br>
inode 링크 방식, 원본파일 삭제시에도 사용가능한 링크 파일 입니다.
```console
# ln file1 file2
```

* 심볼릭 링크 파일(Symbolic Link File= soft link file)<br>
원본 파일 삭제 시에 사용 불가능한 링크 파일입니다.
```console
# ln -s file1 file2
```
    
> 하드링크와 심볼릭 링크의 차이점
- data block link 방식, 원본 삭제시 사용불가
- 파일시스템을 넘어서 링크가능
- 디렉토리에 링크 가능
- 디렉토리 마이그레이션 `/was -> /zeus`
- 여러가지 서비스 디렉토리 통합
- 오픈 소스 프로그램 형태의 소스 버전 관리

**디바이스 파일**<br>
용어: 커널(/dev/*) - 디바이스 드라이버 - 디바이스<br>
   - 블럭 디바이스 파일( block 단위 I/O, 4k, 8k )
   - 캐릭터 디바이스 파일( 바이트 단위 I/O, 512 byte )

