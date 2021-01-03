---
layout: post
title: 'Nextjs + ReduxToolkit 설정하기'
categories: dev
tags: node.js
date: '2021-01-03 20:30:00 +0900'
image: 'https://velopert.com/wp-content/uploads/2016/02/nodejs-2560x1440-950x534.png'
published: true
---
React 프레임워크인 `Next.js`와 Redux 프레임워크인 `Redux-Toolkit`을 사용하여 서버사이드 렌더링을 위한 기본 폴더구조 설정에 대해 다뤄보겠습니다.
<!--more-->

* toc
{:toc .large-only}
  
## 설치
우선 기본적으로 Next.js 및 ReduxToolkit을 설치 해야합니다. 자신이 사용하는 패키지매니저를 사용하여 Next.js 및 Redux-Toolkit을 설치합니다.
```console
$ yarn add next 
$ yarn add @reduxjs/toolkit
```

Redux를 프로젝트와 연결시키기 위한 `next-redux-wrapper` 도 설치하겠습니다.
```console
$ yarn add next-redux-wrapper  
```
위의 세가지 모듈들을 설치해주면 됩니다.

## 설정
리덕스를 사용하기 위해 `store`를 생성해 줍니다.
```javascript
// /store.js
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {createWrapper} from "next-redux-wrapper";
import {reducer} from './lib/slices'

const makeStore = (context) => configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: getDefaultMiddleware()
});

export const wrapper = createWrapper(makeStore, {
    debug: process.env.NODE_ENV !== 'production',
});
```

다음으로 스토어에 연결하기위한 `reducer`를 만들어 줍니다.
```javascript
// /lib/slices/index.js
import {HYDRATE} from "next-redux-wrapper";
import {combineReducers} from '@reduxjs/toolkit';

import {emailSlice} from './email';
import {urlSlice} from './url';

export const reducer = (state = {}, action) => {
    if (action.type === HYDRATE) {
        console.log("HYDRATE", action);
        return {
            ...state,
            ...action.payload
        };
    }
    return combineReducers({
        [emailSlice.name]: emailSlice.reducer,
        [urlSlice.name]: urlSlice.reducer
    })(state, action);
}

```
`HYDRATE`는 next에서 서버사이드 렌더링을 할때 서버의 스토어와 클라이언트의 스토어를 합쳐주는 역할을 합니다.
HYDRATE 액션이 호출될 때 처리하도록 구현합니다.

next에서는 기본적으로 pages 폴더밑에서 렌더링 됩니다. pages 폴더밑에 `index.js` 및 `_app.js`를 만들어 줍니다.
```javascript
// _app.js
import {wrapper} from "../store";

const project = ({ Component, pageProps }) => (
    <>
        <Component {...pageProps} />
    </>
);

export default wrapper.withRedux(project);
```
스토어에서 만든 `wrapper`로 project를 HOC으로 감싸줍니다.

```javascript
// index.js
import AppLayout from '../components/AppLayout';
import InfoList from "../components/InfoList";
import {connect, useDispatch} from "react-redux";
import {loadEmail} from "../lib/actions/email";
import {loadLogs, loadUrl} from "../lib/actions/url";
import {wrapper} from "../store";

const Home = () => {
    return (
        <>
            <AppLayout>
                < InfoList />
            </AppLayout>
        </>)
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({req,res, ...etc})=> {
    console.log('2. Page.getServerSideProps uses the store to dispatch things');
    
    await store.dispatch(loadEmail());
    await store.dispatch(loadUrl());
    await store.dispatch(loadLogs());
})

export default connect(state=> state)(Home);
```
이제 서버사이드 렌더링이 필요한 페이지에서 `getServerSideProps`를 export 시켜주면 스토어에 데이터가 들어있는 상태로 렌더링이 됩니다.
