class Bicycle
  attr_reader :size, :tape_color

  def initialize(args)
    @size = args[:size]
    @tape_color = args[:tape_color]
  end

  # 모든 자전거가 동일한 크기의 타이어와 체인을 기본값으로 갖는다.
  def spares
    {
      chain: '10-speed',
      tire_size: '23',
      tape_color: tape_color
    }
  end

  # 다른 메서드들..
end

bike = Bicycle.new(
  size: 'M',
  tape_color: 'red'
)

bike.size # M
bike.spares
# { :tire_size => '23', :chain => '10-speed' :tape_color => 'red'}