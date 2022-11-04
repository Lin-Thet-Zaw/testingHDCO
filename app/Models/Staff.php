<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Nationality;
use App\Models\Community;

class Staff extends Model
{
    use HasFactory;

    public function nationality()
    {
        return $this->belongsTo(Nationality::class);
    }

    public function community()
    {
        return $this->belongsTo(Community::class);
    }
}
