class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
  end

  # 모두의 기본값
  def default_chain 
    '10-speed'
  end
end

class RoadBike < Bicycle
  # ...
  def default_tire_size
    '23' # 하위클래스 기본값
  end
end

class MountainBike < Bicycle
  # ...
  def default_tire_size
    '2.1' # 하위클래스 기본값
  end
end