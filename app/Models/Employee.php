<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Nationality;
use App\Models\Travel;

class Employee extends Model
{
    use HasFactory;

    public function nationality()
    {
        return $this->belongsTo(Nationality::class);
    }

    public function travel()
    {
        return $this->belongsToMany(Travel::class, 'employee_travel');
    }
}
