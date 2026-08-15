领域驱动设计（Domain Driven Design）
ddd 的思想是业务有限，以业务理解技术

**传统的 MVC 架构文件目录**
```
src/
├── controllers/                 # 接收请求、返回响应
│   ├── ProductController
│   ├── OrderController
│   └── UserController
│
├── models/                      # 数据模型
│   ├── Product
│   ├── Order
│   └── User
│
├── views/                       # 页面或响应模板
│   ├── products/
│   ├── orders/
│   └── users/
│
├── services/                    # 业务逻辑
│   ├── ProductService
│   ├── OrderService
│   └── UserService
│
└─── repositories/                # 数据库访问
    ├── ProductRepository
    ├── OrderRepository
    └── UserRepository
```

controller 层提供接口并解析数据，将数据传递到 service 层
service 获取到数据并组装（可能调用多个业务模块）
mapper 层获取到数据库数据

这样就会导致以下后果：
1. 可维护性差：大量的第三方模块影响核心代码稳定性。
2. 可拓展性差：业务逻辑与数据存储相互依赖，无法复用问题
3. 可测试性差：庞大事务脚本与基础设施强耦合，需要所有模块都提供服务才能测试，无法单元测试。

**DDD 架构文件目录**
```
src/
│   ├── catalog/                     # 商品上下文
│   │   ├── domain/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── event/
│   │   ├── application/
│   │   │   ├── command/
│   │   │   ├── query/
│   │   │   └── dto/
│   │   ├── infrastructure/
│   │   └── interfaces/
│   │
│   ├── ordering/                    # 订单上下文
│   │   ├── domain/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── event/
│   │   ├── application/
│   │   │   ├── command/
│   │   │   ├── query/
│   │   │   └── dto/
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   └── messaging/
│   │   └── interfaces/
│   │
│   └── customer/                    # 用户上下文
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── interfaces/
│
└── README.md
```

虽然 DDD 架构下拆分的文件变多了但项目结构也更加容易理解，相同业务域的代码放在同一个目录中，即使是新接触项目的开发者也能一眼看出来对应的业务在什么地方
更加方便项目的维护


