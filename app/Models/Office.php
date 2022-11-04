<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Town;

class Office extends Model
{
    use HasFactory;

    public function town(){
        return $this->belongsTo(Town::class);
    }
}
