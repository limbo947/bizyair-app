# 查询余额
```
curl -X GET "https://api.bizyair.cn/y/v1/wallet" \
  -H "Authorization: Bearer {BIZYAIR_API_KEY}"
```

响应结果示例：
```
{
  "code": 20000,
  "message": "Ok",
  "status": true,
  "data": {
    "charge_balance": "3.1w",
    "gift_balance": "3.1w",
    "total_balance": "6.3w",
    "charge_balance_amount": 31387,
    "gift_balance_amount": 31707,
    "total_balance_amount": 63094
  }
}
```

# 查询用户信息
```
curl -X GET "https://api.bizyair.cn/x/v1/user/metadata" \
  -H "Authorization: Bearer {BIZYAIR_API_KEY}"
```

响应结果示例：
```
{
  "code": 20000,
  "message": "Ok",
  "status": true,
  "data": {
    "id": "01kke41p7yeqexc8g0nekv169c",
    "name": "似我",
    "status": "normal",
    "level": 10,
    "last_share_id_update_at": "0001-01-01 00:00:00",
    "avatar": "https://storage.bizyair.cn/users/01kke41p7yeqexc8g0nekv169c/20260423/Ngd51G1FFE89ZgsPowvh3M1bn5LoopZh.webp",
    "sub_expire_at": {
      "10": "2026-06-11"
    },
    "third_party_binds": {
      "discord": false,
      "github": false,
      "google": false,
      "h5wechat": false,
      "phone": true,
      "siliconcloud": true,
      "wechat": false
    },
    "user_level_str": "基础版会员"
  }
}
```
