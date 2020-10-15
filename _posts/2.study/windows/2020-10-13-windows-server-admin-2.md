---
layout: post 
title: "Windows 서버 관리 2"
date: 2020-10-08 14:47:00 +0900 
categories: study 
tags: windows
image: https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
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
   
    - 단순 볼륨
    - 스팬 볼륨 (RAID 0 Linear)
    - 스트라이프 볼륨 (RAID 0 Stripe)
    - 미러 ()
* hardware

### 디스크 추가 및 파티션/ 파일시스템 구성 순서
* 단순볼륨: 디스크 추가 및 장치 인식 - online - initialization - partition / fileSystem (format) 
* 레이드: 장치인식 - online - 초기화 - 동적 - 스팬/스프라이프/미러/RAID5 - 파티션/파일시스템

### 디스크 파티션 축소/확대
* **축소** : DISK0 (60G) -> DISK0 (40G + 20G) 
* **확장** : DISK0 (40G + 20G) -> (60G)

### RAID 볼륨에 대한 장애처리
* 스팬/스트라이프 -> 백업본으로 복구 + 새로 구성
* 미러 -> unmirror(미러제거) + mirror(미러추가)
* RAID 5 -> 볼륨복구 + 나머지 데이터 제거

## 저장소 공간(Storage Space)

### 저장소 공간 특성
* 핫 스페어(Hot Spare) -> RAID1/RAID5
* 저장소 계층(tier) 분리
* 나중 쓰기 캐시

### 저장소 공간 만들기
* 단순(복원 없음)
* 미러
* 패러티

### 저장소 풀에 디스크 증설
### 저장소 풀 -> RAID 구성
* 가상디스크1(R1) + 가상디스크2(R1) = R10

### 네트워크 스토리지
* 스토리지 종류
  - DAS
    - internal DAS
    - external DAS
  - NAS
  - SAN
  
## 백업
* 백업의 필요 : 복구, 이관작업 등 사고를 대비하기 위함

### 백업의 종류
* 전체 백업
* 증분 백업 : 증가분을 백업
  - 차등백업
  - 증분 누적 백업

### 백업 디스크 장착
* 백업 - "완전복구, 시스템"
* 복구 
  - 전체 복구
  - 일부 복구
* OS 부팅이 안 될경우의 복원 방법

## 원격 접속 서버 구축
* 원격 접속 서비스
  - TELNET 서버
  - SSH 서버
  - VNC 서버
  - 원격데스크톱 연결
  - 구글 데스크톱 

* Windows 서비스 구축 방법(EX: IIS)
  - 역할/기능 추가 or 서버 프로그램 설치
  - 서비스 설정(inetmgr)
  - 서비스 기동(services.msc)
  - 방화벽 등록(firewall.cpl)

### 텔넷서버
1. 기능 추가 (텔넷 서버, 텔넷 클라이언트)
1. 서비스 기동
1. 방화벽 등록

### SSH 서버
1. Bitvise SSH 서버 설치
1. 서비스설정
1. 서비스 기동

* SSH 연결
* SFTP 연결
* Remote Desktop 연결

### VNC 서버
### 원격 데스크톱
1. 서비스 설정(시스템 - 원격설정)

## 웹 서버와 FTP서버 구축
