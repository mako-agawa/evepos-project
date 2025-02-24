# frozen_string_literal: true

require 'test_helper'

module Api
  module V1
    class EventsControllerTest < ActionDispatch::IntegrationTest
      setup do
        @event1 = events(:event1)
        @event2 = events(:event2)
        @event3 = events(:event3) 
      end

      test "イベント一覧 (index) が正常に取得できる" do
        get api_v1_events_url, as: :json
        assert_response :success

        json_response = JSON.parse(@response.body)

        # イベントが降順（最新の作成順）で取得されるかテスト
        assert_equal @event3.id, json_response[0]["id"] # 最新のイベント
        assert_equal @event2.id, json_response[1]["id"]
        assert_equal @event1.id, json_response[2]["id"] # 一番古いイベント

        # 必要なキーが含まれているか
        required_keys = %w[id title date location description price likes_count user_id image_url user]
        assert required_keys.all? { |key| json_response.first.key?(key) }
      end
    end
  end
end
