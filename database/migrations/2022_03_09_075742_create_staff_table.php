<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStaffTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->integer('staffs');
            $table->bigInteger('community_id')->unsigned();
            $table
                ->foreign('community_id')
                ->references('id')
                ->on('communities')
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
        Schema::dropIfExists('staff');
    }
}
