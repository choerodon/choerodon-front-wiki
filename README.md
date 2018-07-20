# Choerodon-front-wiki
`Choerodon-front-wiki` is the core front service of Choerodon.This project is an overall front-end project that combines the [Choerodon Boot](https://github.com/choerodon/choerodon-front-boot) and [Choerodon Wiki](https://github.com/choerodon/choerodon-front-wiki.git).This service is responsible for the wiki management of all homepages and provides users with a better user experience through a rich interface.

## Features
- Space management(Management platform space)

## Environment Support

* Modern browsers and Internet Explorer 10+（Currently, it is best to browse through Google.）

## Directory structure

The following is the main directory structure:

```
  ├── charts
  ├── wiki
  │   ├── src
  │   │   └── app
  │   │       └── wiki
  │   │           ├── config
  │   │           │   ├── Menu.yml
  │   │           │   └── language
  │   │           ├── containers
  │   │           │   ├── Home.js
  │   │           │   ├── WIKIIndex.js
  │   │           │   ├── global
  │   │           │   ├── organization
  │   │           │   └── project
  │   │           └──  locale
  │   │                ├── en_US.js
  │   │                └── zh_CN.js
  │   └── package.json
  │
  ├── .gitignore
  ├── .gitlab-ci.yml
  ├── config.js
  ├── config.yml
  ├── favicon.ico
  ├── README.md
  └── Dockerfile

```

* `containers` store the front pages
* `local` store multilingual files
* `config` store `Menu.yml` configuration file (including code and icon of  menu, jump into Route, menu permissions) and language in Chinese and English yml (`zh.yml`, `en.yml`)

See more at http://choerodon.io/zh/docs/development-guide/front.

## Development

### Clone the files of project:
```
git clone https://github.com/choerodon/choerodon-front-wiki.git
```

### Init submodules:

```
git submodule update --init
```
See [git submodules documentation.](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

### Enter the directory install dependencies:
Note:This project used a lot of properties such as ES6/7, so node 6.0.0+ is required.

```
cd wiki
npm install
```
### Run

``` 
cd wiki
npm start
```
Open your browser and visit [http://localhost:9090](http://localhost:9090). There is currently no interface for external testing.

## Links

- [Choerodon](http://choerodon.io)
- [Choerodon Forum](http://forum.choerodon.io/)

## Reporting Issues
If you find any shortcomings or bugs, please describe them in the [issue](https://github.com/choerodon/choerodon/issues/new?template=issue_template.md).

## How to Contribute
We welcome all contributions. You can submit any ideas as [pull requests](https://github.com/choerodon/choerodon/pulls). [Follow](https://github.com/choerodon/choerodon/blob/master/CONTRIBUTING.md) to know for more information on how to contribute.
 