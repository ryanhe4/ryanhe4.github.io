---
layout: post
title: "Shell Script 기초"
date: 2020-10-16 16:40:00 +0900
categories: dev
tags: linux
---
<!--more-->

* toc table
{:toc .large-only}
  
## 명령어
* grep
* head/tail
* wc

### sed 명령어
**패턴 검색/ 변환 명령어** <br>
-n option은 not default로 특정 값이 들어간 줄 만 출력
```console
# sed [-n] '1,3p' file1             //1~3줄 출력
# sed [-n] '/root/d' file1          // root를 찾아 삭제
# sed -n '3p' file1 /etc/hosts      // 3번째 줄 출력
# sed '1,3d' /etc/passwd            // 1~3번째줄 삭제
# sed -i 's/root/ROOT' /etc/group   //root를 ROOT로 파일 변경
```

### awk 명령어
**기본**
```console
# awk '/root/' file1
# awk '{print $1, $2}' file1
# awk '/root/ {print $1, $2}' file1
```

**응용**
```console
# awk -F: '$3 >= 1000 && $3 <= 60000 { print $1}' /etc/passwd
# df -h / |tail -1 | awk '{print $5}' | sed 's/.$//'
# ifconfig ens33 |grep broadcast | awk '{print $5}' | awk -F. '{print $4}'
# ps -elf | awk '$2== "Z" {print $0}' 
```

### sort +uniq 명령어
```console
# df -k
# du -sk /var
# cd /var ; du -sk * | sort -nr | more

# sort -u file1
# sort file1 | uniq -d
# sort file1 | uniq -u
```

### cut 명령어

> [주의] 필드 구분자:탭
 
```console
# cut -cl-5 file1
# cut -d ":" -f 1 /etc/passwd
```

### tr CMD
```console
# cat file1 | tr "[A-Z]" "[a-z]"
# cat file1 | tr "[a-z]" "[A-Z]" 
```

### split CMD
```console
# split -d -l 4 file1
```

### paste

## 쉘의 특성
* 파이프
* 메타캐릭터
* 엘리어스
* 함수
* 환경파일

### 리다이렉션
* 입력 리다이렉션
* 출력 리다이렉션
* 에러 리다이렉션

### 변수
* 지역변수
* 환경변수
* 특수변수<br>
`$$`, `$!`, `$?`, `$*`, `$#`

**변수 선언**
```console
# LANG=en_US.UTF-8 ; export LANG
# echo $LANG
# unset LANG
```  

### 메타캐릭터
`''`, `""`, ` `` `, `\ ` , `;`
* sh style: \`date\`
* ksh style: `$(date)`


### 함수
```console
# fun () { CMD; CMD; CMD; )
# fun
# typeset -f
# unset -f fun
```

### 조건부 실행
```console
# [ -f /etc/passwd ] && echp "[ OK ]"
# [ -f /etc/passwd ] && echp "[ OK ]" || echo "[FAIL]" 
```

### dirname/basename 명령어
```console
# dirname /etc/sysconfig/network-scripts/ifcfg-ens33
# basename /etc/sysconfig/network-scripts/ifcfg-ens33
```

{% include adsense.html %}

## 쉘 스크립트
** 쉘 스크립트 생성 및 실행 방법**
```console
# vi test.sh ; bash -x test.sh
# vi test.sh ; . test.sh
# vi test.sh ; chmod 755 test.sh ; ./test.sh
# vi test.sh ; chmod 755 test.sh ; ./test.sh (MAGIC NUMBER: #!/bin/bash)
```

### 매직넘버
**주석**
* 한 줄 -> `#`
* 여러 줄 -> : << EOF ~ EOF

### 문법
**입력 & 출력**
* 입력 (read 명령어)
* 출력 (echo/printf 명령어)

**산술연산**
* expr 4 + 2
* expr 4 - 2
* expr 4 \* 2
* expr 4 / 2
* expr 4 % 2

**조건문**
* if 구문
```shell
if 조건 ; then
    statement
elif 조건 ; then
    statement
else 
    statement
fi    
```
* case 구문
```shell
case VAR in
  var1|var2) statement1 ;;
  var3|var4) statement2 ;;
  *) statement3 ;;
esac
```

**반복문**
* for 구문
```shell
for VAR in 변수
do
    statement
done    
```
* while 구문
```shell
while 조건
do
    statement
done    
```
* 반복문 제어
   - break
   - continue

## 쉘 스크립트 프로그램 작성
**디렉터리 구조 생성 스크립트**<br>
adddir.sh

**계산기 프로그램**<br>
calculator_ver1.sh

**/etc/hosts 파일 내용 추가 프로그램**<br>
hosts.sh

**사용자 관리 프로그램**<br>
* add_user.sh
* del_user.sh
* add_userlist.sh
* user_admin.sh

**두대의 서버의 서비스 비교**<br>
check_service.sh

**보고서 내용 중 일부를 추출하는 프로그램**<br>
check_report.sh

