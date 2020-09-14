---
layout: post
title: "리눅스 서버 관리1"
date: 2020-09-10 09:16:00 +0900
categories: dev
tags: linux 
---
리눅스 서버 관리 명령어
<!--more-->

* toc part
{:toc}

## 디렉토리 구조
>디렉토리 구조와 용도
{:.lead}

### 시스템 디렉토리
    
|디렉토리명 |설명|
|:-----------|:---------------------------------|
|/usr|대부분의 프로그램에 설치되는 공간 , `/bin`, `/share` 등|
|/etc| |
|/lib, /lib64|프로그램들의 각종 라이브러리 들이 존재|
|/bin|기본 명령어들이 모여 있는 디렉토리|
|/sbin| |
|/boot|리눅스 커널이 저장되어 있는 디렉토리|
|/||   
|/tmp|임시 파일들을 위한 디렉토리|      

### 시스템 기본정보 확인 명령어

|시스템 명     |명령어                             |
|:-----------|:---------------------------------|
|Hostname    |# hostname                         |
|OS          |# uname -a<br># cat /etc/redhat-release|
|CPU         |# cat /proc/cpuinfo (# lscpu)         |
|MEM         |# free<br># cat /proc/meminfo          |
|DISK        |# fdisk -l(lsblk)                  |
|NETWORK     |# ifconfig -a(ip addr) <br># netstat -nr(ip route)           |
                             

## 장치관리    
### 1. 디스크 장치 인식 작업
* Disk 물리적 구조 (`sector` -> `track` -> `cylinder` -> `partition` -> `disk`)
* Disk 종류: IDE(SATA), SCSI(SAS), SSD
* Disk 이름 체계
     - IDE: /dev/hda, /dev/hdb, /dev/hdc, /dev/hdd
     - SCSI: /dev/sda, /dev/sdb, /dev/sdc, /dev,sdd, ....등
     - Virtual: /dev/vda, /dev/vdb, /dev/vdc, ...
* 장치 인식 작업
     1. systemd-udevd.service 서비스 확인
     ```console
  # systemclt list-unit-files | grep -i udev
     ```
     1. Power OFF
     1. Disk 장착
     1. Power ON <br>
     ```console
     # ls -l /dev/sd?
     # fdisk -l
     # lsblk
     ```
  
### 2. 파티션 작업 (fdisk, gdksik/parted)
* 파티션 작업 툴
   + fdisk CMD : 2TB 미만
   + gdisk CMD : 2TB 이상
   + parted CMD : 2TB 이상
* 파티션의 종류 & 이름체계
   - Primary Partition(1-4)
   - Extended Partition <br/>
   => Logical Partition[5-15])
* 파티션 작업
```console
# fdisk /dev/sdb
# ls -l /dev/sdb*
# fdisk -l /dev/sdb
# lsblk
```            
                   
### 3. 파일시스템 작업    
* `파일시스템`이란?<br>
  파일을 저장하고 관리하는 구조 체계
* 파일시스템의 종류
    - ext3
    - ext4
    - xfs
* 파일시스템 구조
```console
# dumpe2fs /dev/sdb1
# tune2fs -l /dev/sdb1
```
* 파일시스템 작업
```console
# mkfs -t ext3|ext4|xfs /dev/sdb1
# dumpe2fs /dev/sdb1 | head -30
# tune2fs -l /dev/sdb1
```
* minfree
```console
# mfks -m 10 /dev/sdb1
# tune2fs -m 1 dev/sdb1
```
* 파일시스템 풀(full)인 경우의 작업 절차(target: /waslogs)
```console
# tune2fs -m 1 /dev/sdb1 (/waslogs -> /dev/sdb1)
```           
   로그 분석 작업 & 파일 삭제 작업 => confirm
   
* df 출력 결과에 대한 해석<br>
    `total` = `Used` + `Avail` + `minfree`
### 4. 마운트 작업
>mount CMD, /etc/fstab
{:.lead}

* mount 확인
```
# df -k => 마운트 유무 확인
# mount => 마운트 옵션
# lsblk
```  
* mount 관련 파일들<br>
    `/etc/mtab`   :현재 마운트된 정보<br>
    `/etc/fstab`  : 부팅시에 마운트 할 만한 정보
* mount 관련 명령어들
    - mount CMD 
    ```console
    # mount [-t ext4] [-o defaults] /dev/sdb1 /testmount
    -t ext4: ext3, ext4, xfs, iso9660, vfat, nfs, ....
    -o defaults: rw, suid, dev, exec, auto, nouser, async
    # mount -o remount, rw /
    # mount -o nosuid /home
    # mount /home (/etc/fstab, 정확히 기입했나 확인)
    ```
    ```
    [옵션]: noatime => /var
           ro
           nosuid => /home
    ```
    - umount CMD
        + Busy File System 대한 umount 방법
        ```console
        # umount /home
        # fuser -cu /home (# lsof /home)
        # wall "Regular PM works with /home. (13:00 - 14:00)"
        # fuser -ck /home
        # umount /home
        ```
    - mount -a (/etc/fstab) 마운트 할 만한 정보를 모두 마운트 하는 명령어
    - umount -a (/etc/fstab) 마운트 되어 있는 자원을 모두 해제할 때 사용하는 명령어
    
### 5. 파일시스템 점검
```console
# fsck [-y] /dev/sdb1
# fsck.ext4 [-y] /dev/sdb1
```
* fsck -y 로그 저장
```console
# script -a fsck.log
# fsck -y /dev/sdb1
# exit
# cat fsck.log
```
* 슈퍼블럭 복구(superblock recovery)
    - 자동으로 복구되는 경우
    ```console
    # fsck /dev/sdb1
    ```
    - 수동으로 복구하는 경우
    ```console
    # dumpe2fs /dev/sdb1 | grep -i superblock
    # e2fsck -b 8193 /dev/sdb1
    ```
* 배드블록 복구 
```console
# badblocks -v /dev/sdb1
# e2fsck -cpfv /dev/sdb1
```   

### 6. 파일시스템 모니터링

다음과 같이 `df CMD`, `du CMD`, `find CMD`는 같이 사용될 수 있다.
```console
# df -k
# du -sk /var
# cd /var; du -sk * | sort -nr | more
# find /var -size +300M -type f
```       

## 디스크 추가 작업 순서 정리

1. 디스크 인식(systemd-udevd.service)
1. 파티션 설정(# fdisk /dev/sdc)
1. 파일시스템 작업(# mkfs.ext4 /dev/sdc1)
1. 마운트 작업(# mount /dev/sdc1 /oracle, /etc/fstab)
