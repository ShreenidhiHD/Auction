<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAuctionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('auctions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('created_by');
            $table->text('auction_name');
            $table->text('product_name');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('start_price', 8, 2);
            $table->text('product_description');
            $table->text('product_category');
            $table->text('product_certification');
            $table->enum('delivery_status', ['assigned', 'shipped', 'delivered', 'pending','verified']);
            $table->enum('status', ['active', 'inactive','reported']);
            $table->integer('winner')->nullable();
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
        Schema::dropIfExists('auctions');
    }
}
