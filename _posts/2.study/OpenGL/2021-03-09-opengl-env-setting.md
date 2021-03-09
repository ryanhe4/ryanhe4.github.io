---
layout: post
layout: post
title: "OpenGL + Mingw-w64 프로젝트 세팅"
categories: study
tags: opengl
image: /assets/img/study/OpenGL.png
---
`GLFW` 및 `GLEW` 라이브러리를 사용하는 프로젝트 세팅 과정을 정리합니다.
* 컴파일러는 Mingw-w64 64bit를 사용하였습니다.
* OS는 Windows 10 버전을 사용하였습니다.
<!--more-->

* tocline
{:toc}

## OpenGL 및 GLFW, GLEW이란?
OpenGL은 실제 구현된 라이브러리가 아니고 API 스펙입니다. 

OpenGL 라이브러리 구현시 플랫폼 종속성을 배제하기 위해서  윈도우생성 및 관련 이벤트 처리(사용자 입력 이벤트, 윈도우 크기 조정 이벤트 등)와 OpenGL context, surface 생성을 위한 API는 스펙에 포함되어 있지 않습니다.

이러한 OpenGL을 구현한 라이브러리로 `GLFW`, `SFML`, `SDL`, `FreeGLUT` 등이 있습니다.

본문에서는 `GLFW` 라이브러리를 사용하여 환경설정을 했습니다.

### GLFW
윈도우 창을 생성하거나, 키보드 마우스 입력, 다양한 이벤트 콜백 함수들을 사용하기 위해서 GLFW를 사용합니다.

다음 링크를 통해 다운받을 수 있습니다. `Windows pre-compiled binary`를 받고 압축을 풀면 여러가지 컴파일러 버전의 바이너리가 나옵니다.
저는 Mingw-w64 64bit를 사용하였습니다.

[https://www.glfw.org/](https://www.glfw.org/)

### GLEW
OpenGL Extension Wrangler Library의 약자로 OpenGL의 확장 라이브러리 입니다.
OpenGL 1.1 이후 버전의 OpenGL 기능을 사용하려면 Extension으로 구현된 GLEW를 사용해야합니다. 

다음 링크를 통해 다운받을 수 있습니다.

[http://glew.sourceforge.net/](http://glew.sourceforge.net/)

## 링크
프로젝트 폴더구조를 다음과 같이 설정하였습니다.
```
┌ root
├ GLFW
    ├ lib
    └ include
├ GLEW
    ├ lib
    └ include
├ CMakeLists.txt   
└ main.cpp
```

include 폴더에는 `.h` 헤더파일이 들어가고, lib 폴더에는 `lib*.a` 라이브러리 파일이 들어갑니다.
각 폴더 명에 맞는 lib 및 include 파일을 포함시켜주면 됩니다.

### CMakeLists 작성
```cmake
# file: "CMakeLists.txt"
cmake_minimum_required(VERSION 3.17)
project(프로젝트명)

set(CMAKE_CXX_STANDARD 20)

set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

LINK_DIRECTORIES(${PROJECT_SOURCE_DIR}/GLFW/lib ${PROJECT_SOURCE_DIR}/GLEW/lib)
find_package(OpenGL REQUIRED)
add_executable(graphics main.cpp)
target_include_directories(프로젝트명 PUBLIC ${PROJECT_SOURCE_DIR}/GLFW/include)
target_include_directories(프로젝트명 PUBLIC ${PROJECT_SOURCE_DIR}/GLEW/include)
target_link_libraries(프로젝트명 glfw3 opengl32 glew32)

```

헤더파일 include 및 라이브러리 파일을 링크해주면 됩니다. 

## Hello World!
이제 기본 OpenGL StartUp 코드를 실행하면 다음과 같은 실행 화면을 볼 수 있습니다.

![image](https://user-images.githubusercontent.com/47705875/110440920-89fb6500-80fc-11eb-813e-717e36bfe913.png)
