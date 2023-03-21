const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// 模拟网络延迟
const simulatedLag = 1000

// 创建sqlite连接
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./site.db', sqlite3.OPEN_READWRITE, (err) => { if (err) return console.log(err.message) });

// 模拟数据
const allTeas = [
    { name: 'Black tea', countryOfOrigin: 'China', color: 'Red', ingredients: 'Tea leaves', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Cup_of_black_tea.JPG/330px-Cup_of_black_tea.JPG' },
    { name: 'Green tea', countryOfOrigin: 'China', color: 'Green', ingredients: 'Tea leaves', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Green_tea_3_appearances.jpg/330px-Green_tea_3_appearances.jpg' },
    { name: 'Oolong tea', countryOfOrigin: 'China', color: 'Dark Black', ingredients: 'Tea leaves', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Oolong_tea_leaf.jpg/420px-Oolong_tea_leaf.jpg' },
    { name: 'Mate tea', countryOfOrigin: 'Paraguay', color: 'Red', ingredients: 'Tea leaves', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Mate_en_calabaza.jpg/330px-Mate_en_calabaza.jpg' },
    { name: 'Matcha', countryOfOrigin: 'Japan', color: 'Light green', ingredients: 'Tea powder', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Matcha_Scoop.jpg/330px-Matcha_Scoop.jpg' },
]

// 重建数据库，录入模拟数据
app.post('/reinitialize', (req, res) => {
    try {
        let sql = 'DROP TABLE teas'
        db.run(sql, (err) => {
            if (err) { console.log(err) }
            console.log('现存数据库表已删除。')
            sql = 'CREATE TABLE teas(id INTEGER PRIMARY KEY,name,countryOfOrigin,color,ingredients,picture)'
            db.run(sql, (err) => {
                if (err) { throw err }
                console.log('已新建空数据库表。')
                let count = 0
                allTeas.forEach(tea => {
                    sql = `INSERT INTO teas(name,countryOfOrigin,color,ingredients,picture) VALUES (?,?,?,?,?)`
                    db.run(sql, Object.values(tea), (err) => {
                        if (err) throw err
                        console.log(`已新增条目${tea.name}。`)
                        count = count + 1
                        if (count == allTeas.length) {
                            setTimeout(() => {
                                return res.json({
                                    success: true
                                })
                            }, simulatedLag)
                        }
                    })
                })
            })
        })
    } catch (error) {
        return res.json({
            success: false,
            error: error
        })
    }
})

// 访问 /search 时，根据输入搜索name相似的数据
app.post('/search', (req, res) => {
    try {
        const name = req.body.name
        let sql = `SELECT * FROM teas WHERE name LIKE '%${name}%'`
        db.all(sql, [], (err, rows) => {
            if (err) { return console.log(err) }
            setTimeout(() => {
                return res.json({
                    success: true,
                    teas: rows
                })
            }, simulatedLag)
        })
    } catch (error) {
        return res.json({
            success: false,
            error: error
        })
    }
})

// 访问 /edit/<id> 时，更新指定id的数据，如果id为new，则新增数据
app.post('/edit/:id', (req, res) => {
    try {
        const id = req.params.id
        const teaInfo = [req.body.name, req.body.countryOfOrigin, req.body.color, req.body.ingredients, req.body.picture]
        if (id == 'new') {
            sql = `INSERT INTO teas(name,countryOfOrigin,color,ingredients,picture) VALUES (?,?,?,?,?)`
            db.run(sql, teaInfo, (err) => {
                if (err) throw err
                console.log(`已新增条目${teaInfo[0]}。`)
                setTimeout(() => {
                    return res.json({
                        success: true
                    })
                }, simulatedLag)
            })
        } else {
            let sql = `UPDATE teas SET name = ?, countryOfOrigin = ?, color = ?, ingredients = ?, picture = ? WHERE id = ${id}`
            db.run(sql, teaInfo, (err) => {
                if (err) { throw err }
                console.log(`已更新条目${teaInfo[0]}。`)
                setTimeout(() => {
                    return res.json({
                        success: true
                    })
                }, simulatedLag)
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            error: error
        })
    }
})

// 访问 /delete/<id> 时，删除指定id的数据
app.delete('/delete/:id', (req, res) => {
    try {
        const id = req.params.id
        let sql = `DELETE FROM teas WHERE id = ${id}`
        db.run(sql, (err) => {
            if (err) { throw err }
            setTimeout(() => {
                return res.json({
                    success: true
                })
            }, simulatedLag)
        })
    } catch (error) {
        return res.json({
            success: false,
            error: error
        })
    }
})

app.listen(port, () => {
    console.log(`服务端已在本机 ${port} 端口运行。`)
})