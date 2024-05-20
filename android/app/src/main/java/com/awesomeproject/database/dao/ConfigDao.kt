package com.awesomeproject.database.dao

import androidx.room.Dao
import androidx.room.Query
import com.awesomeproject.database.entities.ConfigEntity

@Dao
interface ConfigDao {
    @Query("select * from CONFIG where CONFIG_ID = 1")
    fun readConfig(): ConfigEntity
}