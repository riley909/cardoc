export enum ResponseMessages {
  INTERNAL_SERVER_ERROR = '서버 오류입니다.',
  SIGNUP_SUCCESS = '회원 가입 성공',
  USER_ID_DUPLICATE = '이미 사용중인 아이디입니다.',
  LOGIN_SUCCESS = '로그인 성공',
  INVALID_USER = '존재하지 않는 회원입니다.',
  USER_DATA_MISS_MATCH = '회원 정보를 다시 확인해 주세요.',
  TIRE_SAVE_SUCCESS = '타이어 정보 저장 성공',
  OUT_OF_LIMIT = `최대 요청 범위를 벗어났습니다.`,
  INVALID_TRIM_ID = '올바르지 않은 trimId 입니다.',
  INVALID_TIRE_VALUE = '올바르지 않은 타이어 규격 정보입니다.',
  TIRE_DUPLICATE = '이미 존재하는 타이어 정보입니다.',
  READ_TIRE_SUCCESS = '타이어 정보 조회 성공',
}
