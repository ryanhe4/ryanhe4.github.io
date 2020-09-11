---
layout: post
title: "리눅스 서버 관리1"
date: 2020-09-10 09:16:00 +0900
categories: study
tags: linux 
---
리눅스 필수 명령어
<!--more-->

* toc part
{:toc}

## 디렉토리 구조
>디렉토리 구조와 용도
{:.lead}

**시스템 디렉토리**
    
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

**시스템 기본정보 확인 명령어**
Hostname    : hostname
OS          : uname -a, cat /etc/redhat-release
CPU         : cat /proc/cpuinfo(lscpu)
MEM         : free, cat /proc/meminfo
DISK        : fdisk -l(lsblk)
NETWORK     : ifconfig -a(ip addr)
              netstat -nr(ip route)         

## 장치관리
>장치 관리
{:.lead}       

1. **디스크 장치 인식 작업**
    * Disk 물리적 구조 (sector -> track -> cylinder -> partition -> disk)
    * Disk 종류: IDE(SATA), SCSI(SAS), SSD
    * Disk 이름 체계
        - IDE: /dev/hda, /dev/hdb, /dev/hdc, /dev/hdd
        - SCSI: /dev/sda, /dev/sdb, /dev/sdc, /dev,sdd, ....등
        - Virtual: /dev/vda, /dev/vdb, /dev/vdc, ...
    * 장치 인식 작업
        1. systemd-udevd.service 서비스 확인
        1. Power OFF
        1. Disk 장착
        1. Power ON <br>
        ```console
        # ls -l /dev/sd?
        # fdisk -l
        # lsblk
        ```
1. **파티션 작업**(fdisk, gdksik/parted)
    * 파티션의 종류 & 이름체계
        - Primary Partition(1-4)
        - Extended Partition
            + Logical Partition[5-15])
                   
1. **파일시스템 작업**       
1. **마운트 작업**     