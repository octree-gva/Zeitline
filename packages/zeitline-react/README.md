# React Zeitline

<!--
[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]
-->

> Zeitline is a flexible timeline implemented in D3.

<!--
[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
-->

### Example

```js
class ZeitlineDemo extends Component {
  render() {
    return <div>
      <Zeitline
        width={800}
        data={[
            {date: new Date('30 Jun 2017'), label: 'first'},
            {date: new Date('10 Jul 2017'), label: 'second'},
        ]}
      />
    </div>
  }
}
```

Check the [demo](demo) to see an example of how using the component.
