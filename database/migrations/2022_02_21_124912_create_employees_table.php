<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->binary('id_front');
            $table->binary('id_back');
            $table->string('position');
            $table->binary('photo');
            $table->tinyInteger('sex');
            $table->boolean('status')->default(1);
            $table->bigInteger('nationality_id')->unsigned();
            $table
                ->foreign('nationality_id')
                ->references('id')
                ->on('nationalities')
                ->onDelete('cascade');
            $table->bigInteger('agencyprofile_id')->unsigned();
            $table
                ->foreign('agencyprofile_id')
                ->references('id')
                ->on('agency_profiles')
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
        Schema::dropIfExists('employees');
    }
}
