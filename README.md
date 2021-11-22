<div align="center">

# [Assignment 7] 카닥

### 원티드x위코드 백엔드 프리온보딩 과제 7

<br>

### **[과제 출제 기업 정보]**

[기업명] **카닥**

</br>

| github                                  | blog                                                                                              | TIL/회고 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- | -------- |
| [riley909](https://github.com/riley909) | [Riley-DevLog](https://yummy-error-929.notion.site/Riley-DevLog-e078b7ef7cbe4d6092d206aebfc42abd) |          |

</div>

<br>
<br>
<br>
<br>

## 📖 과제 내용

### [필수 포함 사항]

- READ.ME 작성
  - 프로젝트 빌드, 자세한 실행 방법 명시
  - 구현 방법과 이유에 대한 간략한 설명
  - **서버 구조 및 디자인 패턴에 대한 개략적인 설명**
  - 완료된 시스템이 배포된 서버의 주소
  - 해당 과제를 진행하면서 회고 내용 블로그 포스팅
- Swagger나 Postman을 이용하여 API 테스트 가능하도록 구현

</br>

### [개발 요구사항]

<details>
  <summary><b>1. 배경 및 공통 요구사항</b></summary>
  <br>

<aside>

😁 **카닥에서 실제로 사용하는 프레임워크를 토대로 타이어 API를 설계 및 구현합니다.**

</aside>

- 데이터베이스 환경은 별도로 제공하지 않습니다.
  **RDB중 원하는 방식을 선택**하면 되며, sqlite3 같은 별도의 설치없이 이용 가능한 in-memory DB도 좋으며, 가능하다면 Docker로 준비하셔도 됩니다.
- 단, 결과 제출 시 README.md 파일에 실행 방법을 완벽히 서술하여 DB를 포함하여 전체적인 서버를 구동하는데 문제없도록 해야합니다.
- 데이터베이스 관련처리는 raw query가 아닌 **ORM을 이용하여 구현**합니다.
- Response Codes API를 성공적으로 호출할 경우 200번 코드를 반환하고, 그 외의 경우에는 아래의 코드로 반환합니다.

| Response Code             | Description                     |
| ------------------------- | ------------------------------- |
| 200 OK                    | 성공                            |
| 400 Bad Request           | Parameter가 잘못된(범위, 값 등) |
| 401 Unauthorized          | 인증을 위한 Header가 잘못됨     |
| 500 Internal Server Error | 기타 서버 에러                  |

</details>

<details>
  <summary><b>2. 사용자 생성 API</b></summary>
<br>

🎁 **요구사항**

- ID/Password로 사용자를 생성하는 API.
- 인증 토큰을 발급하고 이후의 API는 인증된 사용자만 호출할 수 있다.

```jsx
/* Request Body 예제 */

 { "id": "candycandy", "password": "ASdfdsf3232@" }
```

</details>

<details>
  <summary><b>3. 사용자가 소유한 타이어 정보를 저장하는 API</b></summary>
<br>

🎁 **요구사항**

- 자동차 차종 ID(trimID)를 이용하여 사용자가 소유한 자동차 정보를 저장한다.
- 한 번에 최대 5명까지의 사용자에 대한 요청을 받을 수 있도록 해야한다. 즉 사용자 정보와 trimId 5쌍을 요청데이터로 하여금 API를 호출할 수 있다는 의미이다.

```jsx
/* Request Body 예제 */
[
  {
    id: 'candycandy',
    trimId: 5000,
  },
  {
    id: 'mylovewolkswagen',
    trimId: 9000,
  },
  {
    id: 'bmwwow',
    trimId: 11000,
  },
  {
    id: 'dreamcar',
    trimId: 15000,
  },
];
```

🔍 **상세구현 가이드**

- 자동차 정보 조회 API의 사용은 아래와 같이 5000, 9000부분에 trimId를 넘겨서 조회할 수 있다.
  - **자동차 정보 조회 API 사용 예제** → <br>
    📄 [https://dev.mycar.cardoc.co.kr/v1/trim/5000](https://dev.mycar.cardoc.co.kr/v1/trim/5000) <br>
    📄 [https://dev.mycar.cardoc.co.kr/v1/trim/9000](https://dev.mycar.cardoc.co.kr/v1/trim/9000) <br>
    📄 [https://dev.mycar.cardoc.co.kr/v1/trim/11000](https://dev.mycar.cardoc.co.kr/v1/trim/11000) <br>
    📄 [https://dev.mycar.cardoc.co.kr/v1/trim/15000](https://dev.mycar.cardoc.co.kr/v1/trim/15000)
- 조회된 정보에서 타이어 정보는 spec → driving → frontTire/rearTire 에서 찾을 수 있다.
- 타이어 정보는 205/75R18의 포맷이 정상이다. 205는 타이어 폭을 의미하고 75R은 편평비, 그리고 마지막 18은 휠사이즈로써 {폭}/{편평비}R{18}과 같은 구조이다.
  위와 같은 형식의 데이터일 경우만 DB에 항목별로 나누어 서로다른 Column에 저장하도록 한다.

</details>

<details>
  <summary><b>4. 사용자가 소유한 타이어 정보 조회 API</b></summary>
<br>

🎁 **요구사항**

- 사용자 ID를 통해서 2번 API에서 저장한 타이어 정보를 조회할 수 있어야 한다.

</details>

</br>
</br>

## 🛠 사용 기술 및 Tools

### [Back-End] ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

### [Deploy] <img src="https://img.shields.io/badge/AWS_EC2-232F3E?style=for-the-badge&logo=Amazon&logoColor=white"/>

### [Etc.] <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white"/> <img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white">

<!-- <img src="https://user-images.githubusercontent.com/67426853/142720033-26301764-7bbe-4e6b-bc82-e9b19a3dbd3a.png" width=700> -->

<br>
<br>

## DB Schema

</br>
</br>

## 📌 구현 기능

## 📖 API Document

[🔗 Postman Document]()

### API Test 방법

1. 다음 링크로 이동합니다. [postman 링크]()
2. user폴더 안의 회원가입, 로그인 요청을 통하여 accessToken을 획득합니다.
3. 권한이 필요한 api 요청 시 header의 Authorization 항목에 accessToken을 입력하여 요청할 수 있습니다.

- 로그인, 회원가입을 제외한 api 호출시 accessToken이 필요합니다.

## 🪄 설치 및 실행 방법

### 설치

1. 레포지토리를 clone 받습니다

```
$ git clone
```

2. clone한 경로에 들어간 후 의존성을 설치하고 환경 셋팅을 진행합니다.

```
$ cd cardoc
$ npm install
```

3. src 폴더에 docker-compose.yml 파일을 만들어 데이터베이스 연결을 설정합니다.

- [docker-compose.yml 노션 링크]()
- <details><summary><b>링크 접속불가 시 docker-compose 파일 설정 방법</b></summary>

  ```
  version: '3.1'

  services:
    db:
      image: mysql
      command:
        --default-authentication-plugin=mysql_native_password
      restart: always
      ports:
        - '3306:3306'
      environment:
        MYSQL_ROOT_PASSWORD: 원하는 비밀번호
        MYSQL_DATABASE: 원하는 데이터베이스 이름
  ```

</details>

4.서버를 구동합니다.

```
$ npm start
```

<span style="color:red"><b>[수정]</b>5. Unit test 및 End-to-End test를 진행합니다.</span>

```
$ npm test
```

</br>
</br>

## 🛠 Dependencies

</br>

<div align=center>

</div>

</br>
</br>

## Reference

이 프로젝트는 [원티드 프리온보딩 백엔드 코스](https://www.wanted.co.kr/events/pre_onboarding_course_4) 7차 과제 일환으로 카닥에서 출제한 과제를 기반으로 만들었습니다.
