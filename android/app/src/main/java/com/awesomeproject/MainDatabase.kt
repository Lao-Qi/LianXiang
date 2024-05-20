package com.awesomeproject

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.awesomeproject.database.dao.ConfigDao
import com.awesomeproject.database.entities.ConfigEntity

@Database(
    version = 1,
    entities = [ConfigEntity::class],
    exportSchema = false
)
abstract class MainDatabase: RoomDatabase() {
    abstract fun ConfigDao(): ConfigDao
    companion object {
        @Volatile
        private var INSTANCE: MainDatabase? = null
        private const val DATABASE_NAME = "main_database"

        fun getDatabase(context: Context): MainDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    MainDatabase::class.java,
                    DATABASE_NAME
                )
                    // 当架构发生改变的时候直接删除旧架构中的数据
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                return instance
            }
        }
    }
}