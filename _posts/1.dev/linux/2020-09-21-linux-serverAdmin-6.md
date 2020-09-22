---
layout: post
title: "리눅스 서버 관리6 - 백업과 복구"
date: 2020-09-18 09:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
`tar` 명령어를 통한 백업과 복구 방법에 대한 내용 입니다.
<!--more-->

* toc part
{:toc}

# 백업 개요
## 백업의 개념
데이터나 정보가 지닌 가치를 보존하는 것으로 외부의침입, 예기치 못한 사고로부터의 복원, 시스템 백업을 해야한다.
복구를 못했을때 생기는 손실을 방지하기위해 백업을 합니다. 백업시간 && 복구시간은 `3시간 이내`로 해야한다.

# 백업의 종류
백업을 어디에 받는지에 따른 구분 로컬백업/ 원격백업<br>
백업 받는 형태에 따른 구분 완전 백업/ 증분 백업/ 차등 백업

## 로컬 백업(Local Backup)
### tar CMD
```console
# tar cvf file.tar file1 file2
# tar tvf file.tar
# tar xvf file.tar

# tar cvzf file.tar.gz file1 file2
# tar tvzf file.tar.gz
# tar xvzf file.tar.gz

# tar cvjf file.tar.bz2 file1 file2
# tar tvjf file.tar.bz2
# tar xvjf file.tar.bz2

# tar cvJf file.tar.xz file1 file2
# tar tvJf file.tar.xz
# tar xvJzf file.tar.xz
```

### 전체백업 + 증분백업
```console
# tar -g /backup/time.list cvzf home.tar.gz /home
# tar -g /backup/time.list cvzf home1.tar.gz /home

# cd /
# tar -g /backup/time.list xvzf home.tar.gz
# tar -g /backup/time.list xvzf home1.tar.gz
```

{:.note title="백업/복구시 - 절대경로/상대경로"}

### 디렉토리 마이그레이션 
/test1/* -> /test2/* 으로 마이그레이션
```console
# cd /test
# tar cf - . | (cd /test2; tar xf -)
```

### OS 백업
* OS 백업
```console
# tar cvzf /RootBackup/full.tar.gz \
> --exclude=/tmp                   \
> --exclude=/run                   \
> --exclude=/proc                  \
> --exclude=/media                 \
> --exclude=/RootBackup            \
> --absolude-name   /
```

* 특정 디렉토리 제외하고 백업
```console
# tar cvzf /test/full.tar.gz    \
> --exclude=/teat/a \
> --absolute-name /test
```

### tar+ split 명령어를 이용한 분할 압축
```console
# cd /target
# tar czf - . | split -d -b 2048m - target.tar.gz
```

## 원격 백업(Remote Backup)
### rsync CMD
* 로컬 -> 로컬
```console
# rsync -a --delete /backup1[/] /backup2
```
* 로컬 -> REMOTE
```console
# rsync -a --delete -e ssh /backup/ IP:/backup2
```
* REMOTE -> 로컬
```console
# rsync -a --delete -e ssh IP:/backup2/ /backup
```  
* Sync 프로그램
```
ActiveSync : WIN <-> WIN
cwRsync    : WIN <-> Linux/Unix
```

> 주의 /backup1 과 /backup1/의 차이점

[/]를 붙이지 않으면 해당 폴더를 하위폴더로 생성한다.
### Mirror Site with rsync

```
uid=nobody 			
gid=nobody 			
use chroot=no 			
max connections=5 		
timeout=60 			

[Backup] 			
comment=Rsync Backup Server
path=/backup1 		
read only=no 	
```  
{:.note title=/etc/rsyncd.conf}

```console
# systemctl enable rsyncd.socket
# systemctl restart rysncd.socket

# rsync -a --delete -e ssh IP::Backup /backup2
# rsync -a --delete -e ssh /backup2/ IP:/backup2
```