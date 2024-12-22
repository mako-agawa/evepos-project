# app/controllers/api/v1/health_checks_controller.rb
module Api
  module V1
    class HealthChecksController < ApplicationController
      def index
        render json: { status: 'ok' }, status: :ok
      end
    end
  end
end
