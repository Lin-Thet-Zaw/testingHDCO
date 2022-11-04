<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOfficesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('address');
            $table->integer('staffs');
            $table->bigInteger('town_id')->unsigned();
            $table
                ->foreign('town_id')
                ->references('id')
                ->on('towns')
                ->onDelete('cascade');

            $table->bigInteger('profile_id')->unsigned();
            $table
                ->foreign('profile_id')
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
        Schema::dropIfExists('offices');
    }
}
