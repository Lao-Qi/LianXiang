package com.awesomeproject.database.entities

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "CONFIG")
class ConfigEntity {
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "CONFIG_ID")
    var configID = 0

    @ColumnInfo(name = "SERVER_PORT")
    var serverPort = 0
}