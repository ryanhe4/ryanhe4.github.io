---
layout: post
title: "리눅스 서버 관리2"
date: 2020-09-14 09:30:00 +0900
categories: dev
tags: linux 
---
리눅스 서버 관리 명령어
<!--more-->

* toc part
{:toc}

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
* ramdisk 안의 내용은 reboot 후 지워진다.
{:.note}
```console
# free
# mkdir -p /mnt/ramdisk ; mount -t tmpfs none /mnt/ramdisk -o size=10m
# cd /mnt/ramdisk ; ls
# cd ; umount /mnt/ramdisk
```

### NFS 마운트
```console
# showmount -e 172.16.6.249
# mkdir -p /mnt/backup ; mount -t nfs 172.16.6.249:/share /mnt/backup
# cd /mnt/backup ; ls
# cd ; umount /mnt/backup
```

## Logical Volume Manager(LVM)
### 용어
* PV(Physical Volume), PE(Physical Extend)<br>
물리적 볼륨, `PE`는 PV를 여러개로 나눈 맵핑 단위 기본 4M의 크기를 가지고 미러링 방식 Stripe방식이 존재한다
* VG(Volume Group)<br>
`PV`들의 묶음
* LV(Logical Volume), LE(Logical Extend)<br>
논리적 볼륨(가상적인 파티션), `LE`는 LV를 여러개로 나눈 단위를 의미하며 PE와 맵핑된다.

### LVM 작업 순서
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

### LVM 파일시스템 용량 축소
```console
# umount /lv1
# e2fsck -f /dev/vg1/lv1    // 파일시스템 검사
# resize2fs -p /dev/vg1/lv1 2G  // resize
# lvreduce -L 2G /dev/vg1/lv1   // 축소
# mount /lv1        //마운트
```
### LVM 파일시스템 이동 작업
```console
# pvs
# vgextend vg1 /dev/sdg1
# pvmove /dev/sdf1 /dev/sdg1
# vgreduce vg1 /dev/sdf1
```

## Raid