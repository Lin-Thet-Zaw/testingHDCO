<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactPeopleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_people', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 100);
            $table->string('phone_number', 15);
            $table->string('position', 100);
            $table->tinyInteger('sex');
            $table->string('passport');
            $table->string('id_front');
            $table->string('id_back');
            $table->bigInteger('profile_id')->unsigned();
            $table
                ->foreign('profile_id')
                ->references('id')
                ->on('agency_profiles')
                ->onDelete('cascade');
            $table->bigInteger('nationality_id')->unsigned();
            $table
                ->foreign('nationality_id')
                ->references('id')
                ->on('nationalities')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_people');
    }
}
