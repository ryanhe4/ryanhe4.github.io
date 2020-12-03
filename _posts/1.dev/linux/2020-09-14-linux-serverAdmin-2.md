---
layout: post
title: "리눅스 서버 관리2"
date: 2020-09-14 09:30:00 +0900
categories: dev
tags: linux 
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg 
---
리눅스 mount 및 lvm, raid, swap 등 서버 장치 관리 명령어와 사용법 입니다.
<!--more-->

* toc part
{:toc .large-only}

## 기타 마운트 관리
### CD/ DVD 마운트
* 자동 마운트 (Automount)
```console
# cd /run/media/사용자/Label이름 ; ls
# cd ; umount /run/media/사용자/Label이름    
```
* 수동 마운트
```console
# mkdir -p /mnt/cdrom ; mount -t iso9660 -o ro /dev/cdrom /mnt/cdrom
# cd /mnt/cdrom ; ls
# cd ; umount /mnt/cdrom
```

### ISO 이미지 마운트
```console
# mkisofs -o a.iso /etc
# mkdir -p /mnt/iso ; mount -t iso9660 -o loop /test/a.iso
# cd /mnt/iso ; ls
# cd ; umount /mnt/iso
```

### FAT32(vfat) 마운트
* 자동 마운트(Automount)
```console
# cd /run/media/사용자/Label이름 ; ls
# cd ; umount /run/media/사용자/Label이름
```
* 수동 마운트
```console
# mkdir -p /mnt/vfat ; mount -t vfat /dev/sdd1 /mnt/vfat (확인 : lsblk, fdsik)
# cd ; umount /mnt/vfat
```

### NTFS 마운트
* 자동 마운트(Auto mount)
```console
# cd /run/media/사용자/Label이름 ; ls
# cd ; umount /run/media/사용자/Label
```   
* 수동 마운트
```console
# mkdir /mnt/ntfs ; mount -t ntfs /dev/sdd1 /mnt/ntfs
# cd /mnt/ntfs ; ls
# cd ; umount /mnt/ntfs
```

### RAMDISK 마운트
ramdisk 안의 내용은 reboot 후 지워집니다.
{:.note}
```console
# free
# mkdir -p /mnt/ramdisk ; mount -t tmpfs none /mnt/ramdisk -o size=10m
# cd /mnt/ramdisk ; ls
# cd ; umount /mnt/ramdisk
```

### NFS 마운트
NFS(Network File System) 서버는 사전에 구축되있어야 합니다.
{:.note}
```console
# showmount -e 172.16.6.249
# mkdir -p /mnt/backup ; mount -t nfs 172.16.6.249:/share /mnt/backup
# cd /mnt/backup ; ls
# cd ; umount /mnt/backup
```

## Logical Volume Manager(LVM)
### 용어
* PV(Physical Volume), PE(Physical Extend)<br>
물리적 볼륨, `PE`는 PV를 여러개로 나눈 맵핑 단위 기본 4M의 크기를 가지며, `미러링 방식` `Stripe 방식` 등이 존재합니다.
* VG(Volume Group)<br>
`PV`들의 묶음을 나타냅니다. `LV`로 사용하기 전 물리적인 장치를 묶어주는 기능을 합니다.
* LV(Logical Volume), LE(Logical Extend)<br>
논리적 볼륨(가상적인 파티션), `LE`는 LV를 여러개로 나눈 단위를 의미하며 PE와 맵핑됩니다.

### LVM 마운트 작업 순서
1. 파티션 작업 (fdisk, id(-t) => 8e로 변경)
```console
# fdisk /dev/sdc
# pvcreate /dev/sdc1        //pv 생성
# vgcreate vg1 /dev/sdc1    //vg 생성
# lvcreate -l 100%FREE -n lv1 vg1// lv생성
```

2. 파일시스템 작업
```console
# mkfs.ext4 /dev/vg1/lv1
``` 

3. 마운트 작업
```console
# vi /etc/fstab
# mkdir /oracle
# mount /oracle
```

### LVM 관리 명령어
```console
# pv [TAB][TAB]
# vg [TAB][TAB]
# lv [TAB][TAB]
```

### LVM 파일시스템 용량 증설
```console
# vgs           //vg의 남은 용량 확인
# lvextend -l +100%FREE /dev/vg1/lv1 //lv 증가 처리
# resize2fs /dev/vg1/lv1    //파일 시스템 처리
```
마지막 `resize2fs`는 자신의 fs에 따라 다르게 처리해야합니다.
{:.note}

### LVM 파일시스템 용량 축소
```console
# umount /lv1
# e2fsck -f /dev/vg1/lv1    // 파일시스템 검사
# resize2fs -p /dev/vg1/lv1 2G  // resize
# lvreduce -L 2G /dev/vg1/lv1   // 축소
# mount /lv1        //마운트
```

### LVM 방식
* Stripe 방식: 여러개의 물리적 장치를 묶어 하나 처럼 사용하는 방식 입니다. 성능 증가, 안정성 감소하는 특징이 있습니다.
* 미러링 방식: 두개의 장치를 묶어 백업본 처럼 사용하는 방식 입니다. 디바이스가 두개이기 때문에 읽기성능 증가하고 안정성이 증가하는 특징이 있습니다.

### LVM 파일시스템 이동 작업
```console
# pvs
# vgextend vg1 /dev/sdg1
# pvmove /dev/sdf1 /dev/sdg1
# vgreduce vg1 /dev/sdf1
```

## Raid(Redundant Array of Inexpensive Disks, Redundant Array of Independant Disks)
여러 디스크를 하나의 디스크처럼 사용할 수 있도록 하면서 동시에 신뢰성을 높이고 성능을 향상시킬 수 있는 저장 장치 입니다.
### RAID 종류
* Hardware RAID 
* Software RAID -> `mdadm CMD`

### RAID LEVEL
**RAID 0 Concatenate**<br>
LVM 기본 값으로 안정성이 떨어집니다. 

**RAID 0 Stripe**<br>
데이터가 병렬적으로 들어가는 방식으로 R/W 성능이 증가하고, 안정성이 떨어집니다. = LVM의 `Stripe 방식`

**RAID 1 Mirroring**<br>
1G + 1G => 1G, 디스크 사용 효율이 떨어집니다, Read 성능 증가하며, 안정성 높습니다. = LVM의 `Mirror 방식`

**RAID 5**<br>
parity,disk 1G 3장으로 2G를 만드는 방식, 적당한 안정성, 디스크 사용 효율, Read 성능 증가, Write 성능 감소하는 특징을 가집니다.

**RAID 1 + 0**<br>
RAID 1로 구성된 하드를 최종적으로 RAID 0 방식으로 병렬구성(striping) 방식입니다.

**RAID 6**<br>
Parity를 이중화, 두장의 디스크가 나갔을 때 복구 가능한 방식입니다.

**RAID 7**<br>
별도의 운영체제를 가지며 패리티를 관리하는 방식입니다.

### RAID 마운트
**파티션 타입 설정**

파티션 타입을 `fd`로 설정 (RAID)
```console
# fdisk /dev/sdc
# fdisk /dev/sdd
```

**RAID 구성**
```console
# mdadm --create /dev/md0 --level=0 --raid-device=2 /dev/sdc1 /dev/sdd1
# mdadm --detail --scan > /etc/mdadm.conf
# watch cat/proc/mdstat
```

**FS 생성**
```console
# mkfs.ext4 /dev/md0
```

**마운트**
```console
# vi /etc/fstab
# mount -a
# mount /raid0
```

### RAID 삭제
**언마운트**
```console
# vi /etc/fstab
# unmount /raid0
```

**RAID 구성 삭제**
```console
# mdadm --stop /dev/md0
# mdadm --remove /dev/md0
# mdadm --zero-superblock /dev/sdc1 /dev/sdd1
# rm -f /etc/mdadm.conf
```

## SWAP
**스왑이란** 스왑(swap), 페이징 공간(Paging Space), 디스크내에 존재하는 가상적인 메모리공간으로 물리적인 메모리의 연장 공간처럼 쓰이는 공간을 의미합니다.

### SWAP 관련 이슈
* **언제** 스왑을 추가하는가<br>
    증가 추세이면서, SWAP이 80%이상 찼을 때 
* 스왑 공간의 크기
    + 초기 설치시 : OS권장, 메모리에 맞춰 설정
    + 운영시: 소프트웨어에 맞춰 설정
* 스왑을 추가하면 성능이 좋아지는가? 스왑의 추가에 의해 성능이 좋아지지는 않습니다.

### SWAP 관리
**SWAP FILE 추가/ 삭제**
* 추가
```console
# mkdir -p /swap ; dd if=/dev/zero of=/swap/swapfile bs=1M count=1024
# mkswap /swap/swapfile
# swapon /swap/swapfile
# vi /etc/fstab     // 부팅시 처리
```
* 삭제
```console
# swapoff /swap/swapfile
# vi /etc/fstab
# rm -f /swap/swapfile
```

**SWAP Partition 추가/삭제**
* 추가
```console
# fdisk /dev/sdb    (sdb ID : 82)
# mkswap /dev/sdb1 
# swapon /dev/sdb1
# vi /etc/fstab
```
* 삭제
```console
# swapoff /dev/sdb1
# vi /etc/fstab
```
