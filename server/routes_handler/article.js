const db = require('../db')
exports.getArticleType = (req, res) => {
  const sql = `select * from article_type`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('获取文章分类失败！')
    res.send({
      status: 0,
      message: '获取文章分类成功！',
      data: results
    })
  })
}

exports.getArticleList = (req, res) => {
  /**
   * page
   * limit
   * type
   * recommendType 0表示推荐，1表示最新
   */
  let { page, limit, type, recommendType } = req.query

  let sql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id\n`

  type && (sql += `where path='${type}'\n`)

  sql +=
    recommendType == 0
      ? 'ORDER BY view_num DESC,like_num DESC'
      : 'ORDER BY article.create_time DESC'

  sql += `\nlimit ${(page - 1) * limit},${limit};`
  console.log(sql)
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有更多了！', 2)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results
    })
  })
}

exports.getArticleTags = (req, res) => {
  let { id } = req.query

  let sql = `SELECT tag_id,tag_name FROM article_tag_merge
      INNER JOIN tag ON article_tag_merge.tag_id = tag.id 
      WHERE article_id = '${id}'`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('文章不存在！', 0)
    res.send({
      status: 0,
      message: '获取文章标签成功！',
      data: results
    })
  })
}

exports.getArticleDetail = (req, res) => {
  let { id } = req.query

  let sql = `SELECT
      article.id,
      user.nickname,
      user.username,
      user.avatar,
      title,
      content,
      article_type.name AS article_type,
      view_num,
      like_num,
      article.create_time,
      user.id AS user_id 
    FROM
      article
      INNER JOIN article_type ON article.type_id = article_type.id
      INNER JOIN user ON article.user_id = user.id 
    WHERE
      article.id=${id}`

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('文章不存在！', 0)
    res.send({
      status: 0,
      message: '获取文章详情成功！',
      data: results[0]
    })
  })
}