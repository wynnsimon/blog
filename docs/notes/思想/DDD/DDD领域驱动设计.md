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


