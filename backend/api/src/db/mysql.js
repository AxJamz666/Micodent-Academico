function createMysql(mysql, options) {
  const pool = mysql.createPool({ ...options, waitForConnections: true,
    connectionLimit: 10, queueLimit: 0, timezone: '-05:00',
    dateStrings: true, connectTimeout: 10000 });
  pool.transaction = async work => {
    const conn = await pool.getConnection();
    let uncertain = false;
    try {
      await conn.beginTransaction();
      const result = await work(conn);
      await conn.commit();
      return result;
    } catch (error) {
      try { await conn.rollback(); } catch { uncertain = true; }
      throw error;
    } finally {
      if (uncertain) conn.destroy(); else conn.release();
    }
  };
  return pool;
}
module.exports = { createMysql };
