可以在oxlint命令中添加.gitignore的路径让oxlint跳过忽略文件的校验
```shell
oxlint . --fix -D correctness --ignore-path .gitignore
```
