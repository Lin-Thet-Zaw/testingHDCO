<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Travel;

class Town extends Model
{
    use HasFactory;

    public function travels()
    {
        return $this->hasMany(Travel::class);
    }
}
