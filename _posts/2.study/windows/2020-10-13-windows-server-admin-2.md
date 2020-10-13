---
layout: post title: "Windows 서버 관리 2"
date: 2020-10-08 14:47:00 +0900 categories: study tags: windows
image: https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
published: false
---
윈도우 기본 명령어 / 기본 기능

<!--more-->

* toc table 
{:toc .large-only}

## 하드웨어 관리와 RAID
RAID : 관리 용이, 성능 향상 위해 가상 볼륨을 구성
### DISK 종류
* E-IDE -> SATA
* SCSI -> SAS
* SSD
### RAID의 종류
* software
  - R0 , R1 ,R5 + R6 ,R7
  - R10, R5 , R6 ( 주 사용 레이드)  
* hardware

### 디스크 추가 및 파티션/ 파일시스템 구성 순서
1. 디스크 추가 및 장치 인식
1. online
1. initialization
1. partition / fileSystem
