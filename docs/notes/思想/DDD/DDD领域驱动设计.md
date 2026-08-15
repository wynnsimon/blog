# 模型
模型在不同的项目设计中可能有不同的含义，并不统一，这里只讲公认的模型

| 模型                               | 含义                          | 解释                                                              |
| -------------------------------- | --------------------------- | --------------------------------------------------------------- |
| VO（view object）                  | 视图对象，用于展示层，把某个指定页面的展示数据封装起来 | 用于给前端的数据展示，通常会去除不需要的字段数据                                        |
| DTO（Data Transfer Object）        | 用于各层之间的数据传输对象。              | 在不复杂的场景下通常和 BO 不做区分                                             |
| BO（Business Object）              | 业务对象，把业务逻辑封装为一个对象。          | 用于描述复杂业务逻辑，包含多个 DO。比如订单业务通常会包含用户和商品，那么这个 BO 就包含 UerDO 和 GoodsDO |
| PO（Persistent Object）            | 持久化对象，和持久层（如数据库）形成对应的映射关系   | 通常是数据库表的映射，属性和数据库的字段一一对应                                        |
| DO（Domain Object）                | 领域对象，从现实世界中抽象出来的有形或无形的业务实体。 | 和 PO 含义一样                                                       |
| DAO（Data Access Object）          | 配合 PO 对数据库做增删改查             |                                                                 |
| POJO（Plain Ordinary Java Object） | 表示—个简单 java 对象。             |                                                                 |

# DDD
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

DDD 通俗来讲就是将 service 更加细分

**四层架构**
1. 领域层：Domain Layer：放之四海而皆准的理想。系统的核心，纯粹表达业务能力，不需要任何外部依赖。
2. 应用层：Application Layer：理想与现实。协调领域对象，组织形成业务场景。只依赖于领域层。
3. 用户层：∪serInterface：护城河。负责与用户进行交互。解释用户请求，返回用户响应。只依赖于应用层
4. 基础层：InfrastructureLayer：业务与数据分离。为领域层提供持久化机制，为其他层提供通用技术能力。

DDD 也有缺点：类爆炸，要抽离的类型太多，尤其是在 java 本身类就多的语言更为明显


















