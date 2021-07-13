class Trip
  attr_reader :bicycles, :customers, :vehicle

  def prepare(perparers)
    perparers.each {|perparer|
      perparer.prepare_trip(self)}
  end
end

# 모든 preparer가 오리 타입일 때
# 이 객체들은 모두 prepare_trip 메서드를 이해한다.
class Mechanic
  def prepare_trip(trip)
    trip.bicycles.each {|bicycle|
      prepare_bicycle(bicycle)}
  end

  # ...
end

class TripCoordinator
  def prepare_trip(trip)
    buy_food(trip.customers)
  end

  # ...
end

class Driver
  def prepare_trip(trip)
    vehicle = trip.vehicle
    gas_up(vehicle)
    fill_water_tank(vehicle)
  end

  # ...
end