<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Nationality;

class ContactPerson extends Model
{
    use HasFactory;

    public function nationality(){
        return $this->belongsTo(Nationality::class);
    }
}
