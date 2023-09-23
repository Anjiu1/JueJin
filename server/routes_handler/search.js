const db = require('../db')
let total = 0

exports.getComprehensive = (req, res) => {
  let { page, limit, sort, keyWords } = req.query
  keyWords && (keyWords = keyWords.replace(/'/g, ''))

  let sql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id\n
  where status=1 `
  keyWords &&
    (sql += `and title like '%${keyWords}%' or content like '%${keyWords}%'\n`)

  db.query(sql, (_err, results) => (total = results.length))

  switch (sort) {
    case '0':
      sql += 'ORDER BY view_num DESC,like_num DESC'
      break
    case '1':
      sql += 'ORDER BY article.create_time DESC'
      break
    case '2':
      sql += 'ORDER BY like_num DESC,view_num DESC'
      break
  }
  sql += `\nlimit ${(page - 1) * limit},${limit};`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results,
      total
    })
  })
}
exports.getArticleList = (req, res) => {
  let { page, limit, sort, keyWords } = req.query
  keyWords && (keyWords = keyWords.replace(/'/g, ''))

  let sql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id\n
  where status=1 `

  keyWords &&
    (sql += `and title like '%${keyWords}%' or content like '%${keyWords}%'\n`)

  db.query(sql, (_err, results) => (total = results.length))

  switch (sort) {
    case '0':
      sql += 'ORDER BY view_num DESC,like_num DESC'
      break
    case '1':
      sql += 'ORDER BY article.create_time DESC'
      break
    case '2':
      sql += 'ORDER BY like_num DESC,view_num DESC'
      break
  }
  sql += `\nlimit ${(page - 1) * limit},${limit}`
  let randomSortSql = `SELECT * FROM (${sql}) AS sorted_data ORDER BY RAND();`
  db.query(randomSortSql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results,
      total
    })
  })
}
exports.getUserList = (req, res) => {
  let { page, limit, keyWords } = req.query
  keyWords && (keyWords = keyWords.replace(/'/g, ''))

  let sql = `SELECT id,username,nickname,avatar FROM user WHERE(nickname is null and username like '%${keyWords}%')or(nickname LIKE '%${keyWords}%') `
  db.query(sql, (_err, results) => (total = results.length))

  sql += `ORDER BY create_time ASC\nlimit ${(page - 1) * limit},${limit};`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取用户列表成功！',
      data: results,
      total
    })
  })
}

exports.getTagArticle = (req, res) => {
  let { page, limit, sort, tagId } = req.query

  let sql = `SELECT
    article.id,
    USER.nickname,
    USER.username,
    title,
    content,
    cover,
    NAME AS 'article_type',
    view_num,
    like_num,
    article.create_time,
    USER.id AS user_id
  FROM
    article_tag_merge
    INNER JOIN article ON article_tag_merge.article_id = article.id 
    INNER JOIN article_type ON article.type_id = article_type.id
    INNER JOIN USER ON article.user_id = USER.id 
  WHERE tag_id = '${tagId}' AND article.status=1 `
  
  db.query(sql, (_err, results) => (total = results.length))
  let tagName = ''
  let sql2 = `select tag_name from tag where id=${tagId}`
  db.query(sql2, (_err, results) => (tagName = results[0].tag_name))

  switch (sort) {
    case '0':
      sql += 'ORDER BY view_num DESC,like_num DESC'
      break
    case '1':
      sql += 'ORDER BY article.create_time DESC'
      break
    case '2':
      sql += 'ORDER BY like_num DESC,view_num DESC'
      break
  }
  sql += `\nlimit ${(page - 1) * limit},${limit};`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取标签文章成功！',
      data: results,
      total,
      tagName
    })
  })
}
