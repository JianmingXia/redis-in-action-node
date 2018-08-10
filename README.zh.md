Redis in Action (NodeJS)

## 使用体会
### chapter2
- updateToken: 个人觉得使用cookie作为标识符不太合理，每次登录后cookie都会不同，之前使用的cookie对应的数据不会及时清除。可以考虑使用用户对应的全局唯一性ID 或者 updateToken时迁移之前的数据
